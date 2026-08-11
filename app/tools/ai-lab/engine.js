const CHAT_ENDPOINT = "/api/ai-lab/chat";

function parseSSEBlock(block) {
  const lines = block.split("\n");
  let event = "message";
  const dataLines = [];
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!dataLines.length) return null;
  try {
    return { event, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return null;
  }
}

async function consumeSSE(response, onStreamDelta) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Streaming is not supported in this browser.");

  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";

    for (const block of blocks) {
      const parsed = parseSSEBlock(block);
      if (!parsed) continue;
      if (parsed.event === "delta" && parsed.data?.text) {
        onStreamDelta?.(parsed.data.text);
      }
      if (parsed.event === "done") {
        finalResult = parsed.data;
      }
      if (parsed.event === "error") {
        throw new Error(parsed.data?.message || "Streaming failed.");
      }
    }
  }

  if (!finalResult) {
    throw new Error("The reasoning layer did not return a complete response.");
  }
  return finalResult;
}

export async function generateResponse(mode, prompt, options = {}) {
  const payload = {
    mode,
    question: prompt || "",
    conversation: options.conversation,
    followUp: options.followUp,
    density: options.density,
    history: options.history,
    explicitModeChoice: options.explicitModeChoice,
    stream: options.stream !== false,
  };

  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = "I'm having trouble reaching the reasoning layer right now. Please try again.";
    try {
      const errorBody = await response.json();
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (contentType.includes("text/event-stream")) {
    return consumeSSE(response, options.onStreamDelta);
  }

  return response.json();
}

export function formatResponseSections(response = {}) {
  const sections = Array.isArray(response.sections) ? response.sections : [];
  return sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    bullets: section.bullets || [],
    score: section.score,
    tier: section.tier || "primary",
    type: section.bullets?.length ? "bullets" : "text",
  }));
}
