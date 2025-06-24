/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5267",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gamalaptop.vn",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://localhost:7240/api/:path*", // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
