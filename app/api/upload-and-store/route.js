import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Read file from request (but don’t store it anywhere)
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file received" }, { status: 400 });
    }

    // QUICK FIX: return a fake hosted link (just for WhatsApp demo)
    const fakeUrl = "https://example.com/invoice.pdf";

    return NextResponse.json({
      ok: true,
      url: fakeUrl
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
