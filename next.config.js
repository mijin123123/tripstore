/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
