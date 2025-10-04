/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_BACKEND_URL?.startsWith('https') ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^https?:\/\//, '').split(':')[0] || 'localhost',
        port: process.env.NEXT_PUBLIC_BACKEND_URL?.includes(':') ? process.env.NEXT_PUBLIC_BACKEND_URL.split(':')[2]?.split('/')[0] : '8080',
        pathname: '/**',
      },
      // Fallback for localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/**',
      },
    ],
  },
  // Add webpack configuration to handle chunk loading issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Fix for exports is not defined error
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  // Add experimental features for better chunk handling
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion'],
  },
  // Suppress hydration warnings for browser extension attributes
  reactStrictMode: true,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

export default nextConfig