import { beforeEach, describe, expect, it, vi } from "vitest";
import nodemailer from "nodemailer";
import { OPTIONS, POST } from "@/app/api/contact/route";

vi.mock("nodemailer", () => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({ sendMail }));
  return {
    default: {
      createTransport,
    },
  };
});

type RequestOptions = {
  origin?: string;
  contentType?: string;
  ip?: string;
  body?: string;
  url?: string;
};

function createMockNextRequest(options: RequestOptions = {}) {
  const url = options.url ?? "https://portfolio.test/api/contact";
  const headers = new Headers();

  if (options.origin) headers.set("origin", options.origin);
  if (options.contentType) headers.set("content-type", options.contentType);
  if (options.ip) headers.set("x-forwarded-for", options.ip);

  return {
    headers,
    nextUrl: new URL(url),
    text: async () => options.body ?? "",
  } as never;
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Alice",
    email: "alice@example.com",
    subject: "Portfolio inquiry",
    message: "Hello from test",
    ...overrides,
  };
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("contact route integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis as { __contactRateLimitStore?: Map<string, unknown> }).__contactRateLimitStore =
      new Map();

    process.env.SMTP_USER = "smtp@example.com";
    process.env.SMTP_PASS = "smtp-pass";
    process.env.CONTACT_RECEIVER = "receiver@example.com";
  });

  it("[API Test] [Contract Test] [Smoke Test] [Functional Test] [System Test] [Sanity Test] accepts a valid request and returns success", async () => {
    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      ip: "1.1.1.1",
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(req);
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(nodemailer.createTransport).toHaveBeenCalledOnce();
  });

  it("[CSRF Test] blocks cross-origin origin header", async () => {
    const req = createMockNextRequest({
      origin: "https://attacker.test",
      contentType: "application/json",
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("[Configuration Test] [Environment Variable Test] fails if SMTP env vars are missing", async () => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.CONTACT_RECEIVER;

    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
  });

  it("[Security Test] [Input Validation Test] [Injection Test] [XSS Test] rejects malformed schema payload", async () => {
    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      body: JSON.stringify(
        validPayload({
          email: "not-an-email",
          subject: "<script>alert(1)</script>",
          message: "' OR 1=1 --",
        })
      ),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("[Rate Limit Test] [Abuse Test] [Bot Resistance Test] blocks request flood from same IP", async () => {
    const reqFactory = () =>
      createMockNextRequest({
        origin: "https://portfolio.test",
        contentType: "application/json",
        ip: "7.7.7.7",
        body: JSON.stringify(validPayload()),
      });

    const statuses: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const response = await POST(reqFactory());
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });

  it("[Concurrency Test] keeps rate limiter consistent under concurrent burst", async () => {
    const createRequest = () =>
      createMockNextRequest({
        origin: "https://portfolio.test",
        contentType: "application/json",
        ip: "8.8.8.8",
        body: JSON.stringify(validPayload()),
      });

    const responses = await Promise.all(
      Array.from({ length: 8 }, async () => POST(createRequest()))
    );

    const statusCounts = responses.reduce(
      (acc, response) => {
        const key = String(response.status);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(statusCounts["200"]).toBe(5);
    expect(statusCounts["429"]).toBe(3);
  });

  it("[Data Integrity Test] [Data Consistency Test] [Idempotency Test] returns stable success response for repeated valid requests", async () => {
    const req1 = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      ip: "2.2.2.2",
      body: JSON.stringify(validPayload()),
    });
    const req2 = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      ip: "3.3.3.3",
      body: JSON.stringify(validPayload()),
    });

    const [r1, r2] = await Promise.all([POST(req1), POST(req2)]);
    const b1 = await readJson(r1);
    const b2 = await readJson(r2);

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(b1).toEqual({ success: true });
    expect(b2).toEqual({ success: true });
  });

  it("[Authentication Test] rejects request with unsupported content type", async () => {
    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "text/plain",
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("[Authorization Test] [Session Management Test] denies cross-origin submission", async () => {
    const req = createMockNextRequest({
      origin: "https://evil.example",
      contentType: "application/json",
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("[Regression Test] sanitizes CRLF in outbound reply headers", async () => {
    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      contentType: "application/json",
      body: JSON.stringify(
        validPayload({
          name: "Alice\r\nBCC:evil@example.com",
          email: "alice@example.com",
          subject: "Hi\r\nBCC:evil@example.com",
        })
      ),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const transport = vi.mocked(nodemailer.createTransport).mock.results[0]?.value as {
      sendMail: ReturnType<typeof vi.fn>;
    };
    const sendMailArgs = transport.sendMail.mock.calls[0]?.[0] as Record<string, string>;

    expect(sendMailArgs.replyTo).not.toContain("\r");
    expect(sendMailArgs.replyTo).not.toContain("\n");
    expect(sendMailArgs.subject).not.toContain("\r");
    expect(sendMailArgs.subject).not.toContain("\n");
  });

  it("[Integration Test] [API Test] OPTIONS returns CORS response for same origin", async () => {
    const req = createMockNextRequest({
      origin: "https://portfolio.test",
      url: "https://portfolio.test/api/contact",
    });

    const response = await OPTIONS(req);
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("https://portfolio.test");
  });
});
