const withTM = require('next-transpile-modules')(['jquery', 'popper.js']);

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config = withTM.webpack(config)
    config.resolve.alias = {
      ...config.resolve.alias,
      'jquery': require.resolve('jquery'),
      'popper.js': require.resolve('popper.js'),
    }
    return config
  }
}

module.exports = nextConfig
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}