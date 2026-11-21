import type { NextConfig } from "next";

/**
 * Content-Security-Policy. Uygulama dışarıdan hiçbir kaynak yüklemez:
 * next/font/google fontları build sırasında indirip aynı origin'den sunar.
 *
 * - script-src 'unsafe-inline': Next.js'in inline hydration script'leri ve
 *   layout'taki tema script'i (karanlık mod parlamasını önler) için gerekli.
 * - 'unsafe-eval' yalnızca geliştirmede: React dev araçları eval kullanır.
 * - img-src 'self': PNG/CSV dışa aktarımındaki data:/blob: URL'leri <a download>
 *   ile indirilir, <img> olarak yüklenmez; img-src'e eklenmeleri gerekmez.
 */
export function buildCsp(): string {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (process.env.NODE_ENV === "development") scriptSrc.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: buildCsp() },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
