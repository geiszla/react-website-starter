const merge = require('webpack-merge');
const TimeFixPlugin = require('time-fix-plugin');
const webpack = require('webpack');

const { commonServerConfig } = require('./webpack.common.js');
const { devServerUrl, hotServerUrl } = require('./config.js');

module.exports = merge(
  commonServerConfig(devServerUrl, hotServerUrl),
  {
    mode: 'development',
    watch: true,
    entry: ['webpack/hot/poll?1000'],
    output: {
      hotUpdateChunkFilename: './hot_server/[hash].hot-update.js',
      hotUpdateMainFilename: './hot_server/[hash].hot-update.json'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new TimeFixPlugin()
    ]
  }
);
