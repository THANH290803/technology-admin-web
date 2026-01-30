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
    domains: [
      "technology-backend-5hxg.onrender.com", // domain API backend của bạn
      "res.cloudinary.com", // nếu bạn dùng Cloudinary
    ],
  },
}

export default nextConfig
