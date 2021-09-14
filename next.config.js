/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'api.ts'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    API_URL: process.env.API_URL
  }
}
