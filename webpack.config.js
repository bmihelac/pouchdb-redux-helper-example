var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
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
