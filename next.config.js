const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  i18n: {
    locales: ['en-us', 'ar-kw'],
    defaultLocale: 'en-us',
    localeDetection: false,
  },
  images: {
    domains: [
      process.env.NEXT_PUBLIC_IMAGES_PATH,
      'ui-avatars.com',
      'localhost',
      'lmsbe.enegix.co',
    ], // Modify this line as needed
  },
  publicRuntimeConfig: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  webpack: (config) => {
    // load worker files as URLs with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
};

// Make sure adding Sentry options is the last code to run before exporting,
// to ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(withBundleAnalyzer(moduleExports), sentryWebpackPluginOptions);
