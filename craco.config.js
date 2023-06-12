/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/**
 * This file is part of [York.IE React Base Starter Template]
 *
 * (c) 2023 [York.IE] <[support@york.ie]>
 *
 * --------------------------------------------------
 *
 * @module app.v1.carcoConfig
 * @description This code exports an object that specifies various settings and rules for Babel, a popular
 *              JavaScript compiler. The settings include presets for the environment and React, as well as plugins
 *              for transforming runtime and regenerator functions. This configuration can be used by Babel to
 *              compile JavaScript code and provide backwards compatibility for older browsers.
 * @author [Nainik Mehta] <[nainik@york.ie]>
 * @version 1.0.0
 *
 * --------------------------------------------------
 */

const CracoLessPlugin = require('craco-less');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack/webpack.common');

module.exports = (envVars) => {
  const { env } = envVars;
  const envConfig = require(`./webpack/webpack.${env}.js`);
  const config = merge(commonConfig, envConfig);

  return {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
    babel: {
      presets: [
        ['@babel/preset-env'],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],

      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
          },
        ],
      ],
    },
    webpack: { ...config },
  };
};

