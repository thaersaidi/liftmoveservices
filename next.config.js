/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  crossOrigin: 'anonymous',
  experimental: {
    serverComponentsExternalPackages: ["@azure/storage-blob"],
  },
};

module.exports = nextConfig;
