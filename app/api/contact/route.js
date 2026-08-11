import nodemailer from "nodemailer";

export const runtime = "nodejs";

const DEFAULT_CONTACT_EMAIL = "mansi.p.dhruv@gmail.com";

function contactEmail() {
  return process.env.TO_EMAIL || process.env.CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL;
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildMailto(name, email, msg) {
  const subject = encodeURIComponent(`Website contact from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}`);
  return `mailto:${contactEmail()}?subject=${subject}&body=${body}`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 254);
  const msg = String(body.msg || "").trim().slice(0, 5000);

  if (!name || !email || !msg) {
    return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const mailto = buildMailto(name, email, msg);

  if (!smtpConfigured()) {
    console.warn("[contact] SMTP is not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local");
    return Response.json(
      {
        error: "Email sending is not configured on this server yet.",
        mailto,
        email: contactEmail(),
      },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: contactEmail(),
      replyTo: email,
      subject: `Website contact from ${name} <${email}>`,
      text: `From: ${name} <${email}>\n\n${msg}`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failed:", error);
    return Response.json(
      {
        error: "Could not send your message right now. Please use the email link below.",
        mailto,
        email: contactEmail(),
      },
      { status: 500 }
    );
  }
}
