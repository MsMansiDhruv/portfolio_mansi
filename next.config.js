/** @type {import('next').NextConfig} */
const CDN_CACHE = {
  key: "Cache-Control",
  value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
};

const API_CACHE = {
  key: "Cache-Control",
  value: "public, s-maxage=600, stale-while-revalidate=86400",
};

const nextConfig = {
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap", "react-icons"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/lab/:path*",
        headers: [CDN_CACHE],
      },
      {
        source: "/icon.svg",
        headers: [CDN_CACHE],
      },
      {
        source: "/api/medium/:path*",
        headers: [API_CACHE],
      },
      {
        source: "/api/linkedin/:path*",
        headers: [API_CACHE],
      },
    ];
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

module.exports = nextConfig;
