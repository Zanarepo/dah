const webpack = require('webpack');

module.exports = {
  webpack: (config, env) => {
    // Add polyfills for missing Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer'),
      // Add other modules as needed
    };

    // Provide Buffer globally in the browser
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'], // Make Buffer available globally
      }),
    ];

    return config;
  },
};
