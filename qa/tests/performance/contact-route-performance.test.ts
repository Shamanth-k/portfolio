import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

vi.mock("nodemailer", () => {
  const sendMail = vi.fn(async () => ({ accepted: ["receiver@example.com"] }));
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
  headers.set("content-type", options.contentType ?? "application/json");

  if (options.origin) headers.set("origin", options.origin);
  if (options.ip) headers.set("x-forwarded-for", options.ip);

  return {
    headers,
    nextUrl: new URL(url),
    text: async () =>
      options.body ??
      JSON.stringify({
        name: "Perf User",
        email: "perf@example.com",
        subject: "Perf",
        message: "Message",
      }),
  } as never;
}

describe("contact route performance and resilience", () => {
  beforeEach(() => {
    (globalThis as { __contactRateLimitStore?: Map<string, unknown> }).__contactRateLimitStore =
      new Map();
    process.env.SMTP_USER = "smtp@example.com";
    process.env.SMTP_PASS = "smtp-pass";
    process.env.CONTACT_RECEIVER = "receiver@example.com";
  });

  it("[Performance Test] [Latency Test] [Non-Functional Test] single request responds within acceptable local latency", async () => {
    const start = Date.now();
    const response = await POST(
      createMockNextRequest({
        origin: "https://portfolio.test",
        ip: "21.21.21.21",
      })
    );
    const durationMs = Date.now() - start;

    expect(response.status).toBe(200);
    expect(durationMs).toBeLessThan(500);
  });

  it("[Load Test] [Throughput Test] handles sustained valid traffic across unique IPs", async () => {
    const total = 30;
    const start = Date.now();
    const responses = await Promise.all(
      Array.from({ length: total }, (_, i) =>
        POST(
          createMockNextRequest({
            origin: "https://portfolio.test",
            ip: `10.0.0.${i + 1}`,
          })
        )
      )
    );
    const elapsed = Date.now() - start;
    const successCount = responses.filter((r) => r.status === 200).length;

    expect(successCount).toBe(total);
    expect(elapsed).toBeLessThan(3000);
  });

  it("[Stress Test] [Spike Test] enforces rate limiting under sudden flood from one IP", async () => {
    const responses = await Promise.all(
      Array.from({ length: 20 }, () =>
        POST(
          createMockNextRequest({
            origin: "https://portfolio.test",
            ip: "99.99.99.99",
          })
        )
      )
    );

    const successCount = responses.filter((r) => r.status === 200).length;
    const limitedCount = responses.filter((r) => r.status === 429).length;

    expect(successCount).toBe(5);
    expect(limitedCount).toBe(15);
  });

  it("[Soak Test] [Volume Test] [Scalability Test] remains stable over repeated batches", async () => {
    let okCount = 0;
    for (let batch = 0; batch < 8; batch += 1) {
      const responses = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          POST(
            createMockNextRequest({
              origin: "https://portfolio.test",
              ip: `172.16.${batch}.${i + 1}`,
            })
          )
        )
      );
      okCount += responses.filter((r) => r.status === 200).length;
    }

    expect(okCount).toBe(40);
  });

  it("[Failover Test] [Resilience Test] [Recovery Test] degrades safely when SMTP configuration fails and recovers after restoration", async () => {
    delete process.env.SMTP_PASS;

    const failingResponse = await POST(
      createMockNextRequest({
        origin: "https://portfolio.test",
        ip: "55.55.55.55",
      })
    );

    expect(failingResponse.status).toBe(500);
    process.env.SMTP_PASS = "smtp-pass";

    const recoveredResponse = await POST(
      createMockNextRequest({
        origin: "https://portfolio.test",
        ip: "56.56.56.56",
      })
    );
    expect(recoveredResponse.status).toBe(200);
  });
});
