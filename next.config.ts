import type { NextConfig } from "next";

// The FastAPI backend (see backend/README.md). Server-side only - the
// browser never talks to it directly.
const apiUrl = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    // Uploaded images are stored by the API as /media/... paths. Proxying
    // them keeps them same-origin, so next/image optimizes them like any
    // file in public/.
    return [{ source: "/media/:path*", destination: `${apiUrl}/media/:path*` }];
  },
};

export default nextConfig;
