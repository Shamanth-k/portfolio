import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const payload = {
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "I would like to connect.",
    };

    const result = contactSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields due to strict mode", () => {
    const payload = {
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "I would like to connect.",
      role: "admin",
    };

    const result = contactSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects oversized fields", () => {
    const payload = {
      name: "a".repeat(101),
      email: "alice@example.com",
      subject: "b".repeat(151),
      message: "c".repeat(2001),
    };

    const result = contactSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const payload = {
      name: "Alice",
      email: "not-an-email",
      subject: "Hello",
      message: "Message",
    };

    const result = contactSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
