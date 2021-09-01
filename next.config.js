/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'api.ts'],
  env: {
    API_URL: process.env.API_URL
  }
}
