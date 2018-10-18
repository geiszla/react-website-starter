const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const webpack = require('webpack');

const jsxRules = {
  rules: [{
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }]
};

const cleanOptions = {
  root: path.resolve(__dirname, '../')
};

// Server configuration
const commonServerConfig = (serverUrl, scriptsUrl) => ({
  context: path.resolve(__dirname, '../server'),
  entry: ['./server.jsx'],
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.bundle.js'
  },
  devtool: false,
  node: {
    __dirname: true,
    __filename: true
  },
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      SERVER_URL: JSON.stringify(serverUrl),
      SCRIPTS_URL: JSON.stringify(scriptsUrl)
    }),
    new CleanWebpackPlugin(['dist'], cleanOptions)
  ],
  module: jsxRules,
  stats: { modules: false }
});

// Client configuration
const commonClientConfig = (serverUrl, scriptsUrl) => ({
  context: path.resolve(__dirname, '../src'),
  entry: ['./index.jsx'],
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../www/scripts'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER_URL: JSON.stringify(serverUrl),
      SCRIPTS_URL: JSON.stringify(scriptsUrl)
    }),
    new ReactLoadablePlugin({
      filename: 'www/scripts/react-loadable.json'
    })
  ],
  module: jsxRules,
  stats: { modules: false }
});

module.exports = { commonServerConfig, commonClientConfig };
