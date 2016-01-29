var config = require('./webpack-base.config');

config.devtool = 'source-map';
config.output.publicPath = '/dist/';

module.exports = config;

