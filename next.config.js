/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: isProd ? '/varun-protofilo' : '',
  assetPrefix: isProd ? '/varun-protofilo/' : '',
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig
