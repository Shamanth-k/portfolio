import { describe, expect, it } from "vitest";
import { isSafeExternalUrl, stripCrLf } from "@/lib/security";

describe("stripCrLf", () => {
  it("removes carriage return and line feed characters", () => {
    const value = "Hello\r\nBCC:attacker@example.com";
    expect(stripCrLf(value)).toBe("Hello BCC:attacker@example.com");
  });

  it("trims surrounding whitespace", () => {
    expect(stripCrLf("  test\r\n")).toBe("test");
  });
});

describe("isSafeExternalUrl", () => {
  it("accepts https URLs", () => {
    expect(isSafeExternalUrl("https://example.com")).toBe(true);
  });

  it("rejects non-https protocols", () => {
    expect(isSafeExternalUrl("http://example.com")).toBe(false);
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(isSafeExternalUrl("not-a-url")).toBe(false);
  });
});

