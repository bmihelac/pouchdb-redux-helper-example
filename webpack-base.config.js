var path = require('path');

module.exports = {
  entry: {
    example1: './src/example1',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src')
      ]
    }]
  }
};

