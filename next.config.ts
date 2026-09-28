import type { NextConfig } from "next";

// Conservative security headers applied to every response. A full
// Content-Security-Policy is intentionally left out for now - it needs
// browser testing against GSAP, inline styles, next/image and the contact
// page's Google Maps iframe before it can be enabled without breaking them.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
