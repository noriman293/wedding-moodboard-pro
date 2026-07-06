/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'cloudinary.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        pdfChunk: {
          test: /[\\/]node_modules[\\/](@react-pdf)[\\/]/,
          name: 'pdf-vendors',
          priority: 10,
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
