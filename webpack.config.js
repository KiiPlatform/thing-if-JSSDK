var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var libraryName = 'ThingIF',
    libraryFileName = 'thing-if',
    plugins = [],
    outputFile = libraryFileName + '.js';

var config = {
  devtool: 'source-map',
  entry: ['./src/ThingIFSDK.ts'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    "es6-promise": "es6-promise",
    "popsicle": "popsicle",
    "make-error-cause": "make-error-cause",
    "winston": "winston"
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    modules: [path.resolve('./src'), "node_modules"],
    extensions: [".ts"]
  },
  plugins: plugins
};

module.exports = config;