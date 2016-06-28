var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');
 
var libraryName = 'ThingIF',
    libraryFileName = 'thing-if-sdk',
    plugins = [],
    outputFile;
 
if (yargs.argv.p) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  outputFile = libraryFileName + '.min.js';
} else {
  outputFile = libraryFileName + '.js';
}
 
var config = {
  devtool: 'source-map',
  entry: ['./src/PublicIndex.ts'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: [ '', '.ts']
  },
  plugins: plugins
};
 
module.exports = config;