import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/validation/contact";
import { stripCrLf } from "@/lib/security";

const MAX_BODY_BYTES = 10 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __contactRateLimitStore?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalRateLimitStore.__contactRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalRateLimitStore.__contactRateLimitStore) {
  globalRateLimitStore.__contactRateLimitStore = rateLimitStore;
}

function getIpAddress(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function getCorsHeaders(req: NextRequest, isOriginAllowed: boolean): HeadersInit {
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };

  const origin = req.headers.get("origin");
  if (isOriginAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    return false;
  }

  return origin === req.nextUrl.origin;
}

function consumeRateLimit(ip: string): { limited: boolean } {
  return consumeWindowRateLimit(rateLimitStore, ip, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS);
}

function consumeWindowRateLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  windowMs: number,
  maxRequests: number
): { limited: boolean } {
  const now = Date.now();

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  if (current.count >= maxRequests) {
    return { limited: true };
  }

  current.count += 1;
  store.set(key, current);
  return { limited: false };
}

export async function OPTIONS(req: NextRequest) {
  const originAllowed = isOriginAllowed(req);
  return new NextResponse(null, {
    status: originAllowed ? 204 : 403,
    headers: getCorsHeaders(req, originAllowed),
  });
}

export async function POST(req: NextRequest) {
  const originAllowed = isOriginAllowed(req);
  const corsHeaders = getCorsHeaders(req, originAllowed);

  if (!originAllowed) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 400, headers: corsHeaders }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 400, headers: corsHeaders }
    );
  }

  const ip = getIpAddress(req);
  const rateLimit = consumeRateLimit(ip);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 413, headers: corsHeaders }
      );
    }

    let jsonPayload: unknown;
    try {
      jsonPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 400, headers: corsHeaders }
      );
    }

    const parsedPayload = contactSchema.safeParse(jsonPayload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { name, email, subject, message } = parsedPayload.data;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiver = process.env.CONTACT_RECEIVER || smtpUser;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;
    if (!smtpUser || !smtpPass || !receiver || !contactFromEmail) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500, headers: corsHeaders }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeName = stripCrLf(name);
    const safeSubject = stripCrLf(subject);
    const safeEmail = stripCrLf(email);
    const safeFromEmail = stripCrLf(contactFromEmail);
    const safeReceiver = stripCrLf(receiver);

    await transporter.sendMail({
      from: safeFromEmail,
      to: safeReceiver,
      replyTo: safeEmail,
      subject: `Contact from ${safeName}: ${safeSubject}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\nMessage: ${message}`,
    });

    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: corsHeaders }
    );
  }
}
