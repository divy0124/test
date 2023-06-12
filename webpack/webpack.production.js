
/**
 * This file is part of [York.IE React Base Starter Template]
 *
 * (c) 2023 [York.IE] <[support@york.ie]>
 *
 * --------------------------------------------------
 *
 * @module app.v1.WebpackConfiguration
 * @description Webpack Production Configuration.
 * @author [Nainik Mehta] <[nainik@york.ie]>
 * @version 1.0.0
 *
 * --------------------------------------------------
 */

// const webpack = require("webpack");
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  devtool: false,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   "process.env.name": JSON.stringify("PROJECT_NAME"),
    // }),
    // new BundleAnalyzerPlugin(),
  ],
};

