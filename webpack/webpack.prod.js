const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const { commonServerConfig, commonClientConfig } = require('./webpack.common.js');
const { productionServerUrl } = require('./config.js');

const serverConfig = merge(
  commonServerConfig(productionServerUrl, productionServerUrl),
  {
    mode: 'production',
    optimization: {
      minimize: false
    }
  }
);

const clientConfig = merge(
  commonClientConfig(productionServerUrl, productionServerUrl),
  {
    mode: 'production',
    devtool: 'none',
    output: {
      publicPath: 'scripts/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader']
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        })
      ]
    }
  }
);

module.exports = [serverConfig, clientConfig];
