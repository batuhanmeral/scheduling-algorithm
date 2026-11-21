import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig, { SECURITY_HEADERS, buildCsp } from "./next.config";

function header(key: string): string {
  const found = SECURITY_HEADERS.find((h) => h.key === key);
  if (!found) throw new Error(`missing header ${key}`);
  return found.value;
}

function parseCsp(value: string): Record<string, string[]> {
  return Object.fromEntries(
    value
      .split(";")
      .map((directive) => directive.trim().split(/\s+/))
      .filter((parts) => parts[0] !== "")
      .map(([name, ...sources]) => [name, sources]),
  );
}

// next/font/google fontları build sırasında indirip aynı origin'den sunar;
// uygulama başka bir dış kaynak yüklemez.
const EXPECTED_CSP: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'"],
  "font-src": ["'self'"],
  "connect-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};

describe("next.config security headers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("applies the security headers rule to all paths", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toEqual([{ source: "/(.*)", headers: SECURITY_HEADERS }]);
  });

  it("hides the X-Powered-By header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("sends the seven security headers in order", () => {
    expect(SECURITY_HEADERS.map((h) => h.key)).toEqual([
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ]);
  });

  it("keeps the exact values of the non-CSP headers", () => {
    expect(header("Strict-Transport-Security")).toBe(
      "max-age=63072000; includeSubDomains",
    );
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("X-Frame-Options")).toBe("DENY");
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
    expect(header("Cross-Origin-Opener-Policy")).toBe("same-origin");
  });

  it("keeps every CSP directive with its exact sources outside development", () => {
    const value = header("Content-Security-Policy");
    expect(parseCsp(value)).toEqual(EXPECTED_CSP);
    expect(value).not.toContain("'unsafe-eval'");
  });

  it("allows 'unsafe-eval' only in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(parseCsp(buildCsp())["script-src"]).toEqual([
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
    ]);
    vi.stubEnv("NODE_ENV", "production");
    expect(parseCsp(buildCsp())["script-src"]).toEqual([
      "'self'",
      "'unsafe-inline'",
    ]);
  });
});
