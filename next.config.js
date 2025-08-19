// const withPWA = require('next-pwa') // REMOVED
// const runtimeCaching = require('next-pwa/cache') // REMOVED
const linguiConfig = require('./lingui.config.js')
const defaultTheme = require('tailwindcss/defaultTheme')

const { ChainId } = require('@sushiswap/core-sdk')

const { locales, sourceLocale } = linguiConfig
const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const { withSentryConfig } = require('@sentry/nextjs')

// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]

    return config
  },
  swcMinify: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'app.sushi.com',
      'raw.githubusercontent.com',
      'dummyimage.com',
      'ipfstest.daidai.io',
      'statictest.stars.finance',
      'teststatic.stars.finance',
      'test.golfdao.io',
      'static.golfdao.io',
      'static.stars.finance',
      'statictest.golfdao.io',
      'ipfs.io',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/add/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/legacy/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/swap',
        destination: '/legacy/swap',
      },
      {
        source: '/swap/:token*',
        destination: '/legacy/swap/:token*',
      },
      {
        source: '/limit-order',
        destination: '/legacy/limit-order',
      },
      {
        source: '/limit-order/:token*',
        destination: '/legacy/limit-order/:token*',
      },
      {
        source: '/open-order',
        destination: '/legacy/open-order',
      },
      {
        source: '/pool',
        destination: '/legacy/pool',
      },
      {
        source: '/find',
        destination: '/legacy/find',
      },
      {
        source: '/migrate',
        destination: '/legacy/migrate',
      },
    ]
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
  publicRuntimeConfig: {
    breakpoints: screens,
  },
}

const SentryWebpackPluginOptions = {
  // ...
}

// REMOVED withPWA wrapper
module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), SentryWebpackPluginOptions)