/**
 * Dependencies
 */
var path = require('path');
var filenames = require('metalsmith-filenames');
var layouts = require('metalsmith-layouts');
var metalsmith = require('metalsmith');
var rename = require('metalsmith-rename');

/**
 * Build
 */
metalsmith(path.join(__dirname, 'templates'))
  .clean(false)
  .destination(__dirname)
  .use(filenames()) // Necessary for extends and includes
  .use(layouts('swig'))
  .use(rename([[/\.swig/, '.html']]))

  .build(function(err){
    if (err) throw err;
  });
