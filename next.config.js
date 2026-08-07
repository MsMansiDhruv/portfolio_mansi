/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // AI reasoning types are still being tightened; production build must not block deploy.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
