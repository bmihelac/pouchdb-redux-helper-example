var path = require('path');
var fs = require('fs');


var pouchdbReduxHelperPath = fs.realpathSync(path.resolve(__dirname, 'node_modules/pouchdb-redux-helper/src'));

module.exports = {
  entry: {
    example1: './src/example1',
    example2: './src/example2',
    example3: './src/example3',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
  ],
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    alias: {
      'pouchdb-redux-helper': pouchdbReduxHelperPath,
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src'),
        pouchdbReduxHelperPath,
      ]
    }]
  }
};

