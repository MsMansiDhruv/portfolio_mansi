import { generateAIResponse, type GenerateAIResponseInput } from "@/lib/ai/generate-ai-response";
import { isLLMConfigured } from "@/lib/ai/config";
import { AIProviderError, toUserSafeErrorMessage } from "@/lib/ai/providers/provider";

export const runtime = "nodejs";

const MAX_QUESTION_LENGTH = 4000;

type ChatRequestBody = {
  mode?: string;
  question?: string;
  density?: "concise" | "detailed";
  conversation?: GenerateAIResponseInput["conversation"];
  followUp?: GenerateAIResponseInput["followUp"];
  history?: GenerateAIResponseInput["history"];
  explicitModeChoice?: boolean;
  stream?: boolean;
};

function sanitizeQuestion(value: unknown): string {
  return String(value || "")
    .trim()
    .slice(0, MAX_QUESTION_LENGTH);
}

function validateBody(body: ChatRequestBody) {
  const question = sanitizeQuestion(body.question);
  if (!question) {
    return { error: "Question is required.", status: 400 as const };
  }
  const mode = String(body.mode || "ask").trim();
  const density = body.density === "detailed" ? "detailed" : "concise";
  return {
    input: {
      mode,
      question,
      density,
      conversation: body.conversation,
      followUp: body.followUp,
      history: Array.isArray(body.history) ? body.history.slice(-8) : undefined,
      explicitModeChoice: body.explicitModeChoice === true,
    } satisfies GenerateAIResponseInput,
  };
}

function sseEncode(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateBody(body);
  if ("error" in validated) {
    return Response.json({ error: validated.error }, { status: validated.status });
  }

  const wantsStream = body.stream !== false && isLLMConfigured();

  if (!wantsStream) {
    try {
      const result = await generateAIResponse(validated.input);
      return Response.json(result);
    } catch (error) {
      console.error("[ai-lab/chat] generation failed:", error);
      const message = toUserSafeErrorMessage(error);
      const status = error instanceof AIProviderError && error.code === "missing_api_key" ? 503 : 500;
      return Response.json({ error: message }, { status });
    }
  }

  const encoder = new TextEncoder();
  const abortController = new AbortController();
  request.signal.addEventListener("abort", () => abortController.abort());

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await generateAIResponse({
          ...validated.input,
          stream: true,
          signal: abortController.signal,
          onStreamDelta: (_delta, accumulated) => {
            controller.enqueue(encoder.encode(sseEncode("delta", { text: accumulated })));
          },
        });
        controller.enqueue(encoder.encode(sseEncode("done", result)));
        controller.close();
      } catch (error) {
        console.error("[ai-lab/chat] streaming generation failed:", error);
        controller.enqueue(
          encoder.encode(
            sseEncode("error", {
              message: toUserSafeErrorMessage(error),
            })
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
