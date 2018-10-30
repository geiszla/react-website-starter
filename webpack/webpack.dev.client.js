const LoadablePlugin = require('@loadable/webpack-plugin');
const merge = require('webpack-merge');
const RemoveSourceMapUrlWebpackPlugin = require('@rbarilani/remove-source-map-url-webpack-plugin');
const webpack = require('webpack');

const { commonClientConfig } = require('./webpack.common.js');
const {
  devServerUrl, hotServerHost, hotServerPort, hotServerUrl
} = require('./config.js');

module.exports = merge(
  commonClientConfig(devServerUrl, hotServerUrl),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8081',
      'webpack/hot/only-dev-server'
    ],
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
      host: hotServerHost,
      port: hotServerPort,
      hot: true,
      stats: { modules: false }
    },
    output: {
      publicPath: `${hotServerUrl}/scripts/`,
      hotUpdateChunkFilename: 'hot/[hash].hot-update.js',
      hotUpdateMainFilename: 'hot/[hash].hot-update.json'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new RemoveSourceMapUrlWebpackPlugin(),
      new LoadablePlugin({ filename: './dist/loadable-manifest.json' })
    ]
  }
);
