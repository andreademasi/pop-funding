/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.teal/,
            use: 'raw-loader',
        })

        return config
    },
}

/*

const withOffline = require('next-offline')

// your next.js configs
const nextConfig = {}

module.exports = withOffline(nextConfig)

*/