import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/businesses/road-safety", destination: "/businesses/safety", permanent: true },
      { source: "/businesses/fire-safety", destination: "/businesses/safety", permanent: true },
    ];
  },
};

export default nextConfig;
