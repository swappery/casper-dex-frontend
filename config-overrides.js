const webpack = require("webpack");

module.exports = {
  webpack: function (config) {
    // config.plugins.push(
    //   new webpack.ProvidePlugin({
    //     Buffer: ["buffer", "Buffer"],
    //   })
    // );

    config.resolve.fallback = {
      fs: false,
    };
    return config;  
  },
};
