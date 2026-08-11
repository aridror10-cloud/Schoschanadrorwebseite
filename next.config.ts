import type { NextConfig } from "next";

/**
 * Sicherheits-Kopfzeilen fuer alle Antworten.
 * Hinweis: Diese greifen nur beim Betrieb als Server (Vercel, Node).
 * Bei einem statischen Export muessen sie beim Hoster gesetzt werden.
 */
const securityHeaders = [
  // Verhindert MIME-Type-Raten durch den Browser
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Beim Wechsel auf fremde Seiten keine vollstaendige URL uebertragen
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kein Zugriff auf Kamera, Mikrofon, Standort
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Schutz gegen Clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // HTTPS erzwingen
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Versteckt die Kopfzeile "X-Powered-By: Next.js"
  poweredByHeader: false,

  // Erzeugt saubere URLs ohne abschliessenden Schraegstrich
  trailingSlash: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
