
/**
 * This file is part of [York.IE React Base Starter Template]
 *
 * (c) 2023 [York.IE] <[support@york.ie]>
 *
 * --------------------------------------------------
 *
 * @module app.v1.WebpackConfiguration
 * @description Webpack Development Configuration.
 * @author [Nainik Mehta] <[nainik@york.ie]>
 * @version 1.0.0
 *
 * --------------------------------------------------
 */

const webpack = require('webpack');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 8080,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('PROJECT_NAME'),
    }),
    // new ReactRefreshWebpackPlugin(), // To maintain the state of the app when it refreshes
  ],
};
