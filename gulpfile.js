var gulp = require("gulp");
var del = require('del');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

// clean dist folder
gulp.task("clean", function(){
  return del([
    'dist/*'
  ])
});
gulp.task("default", ['clean'], function () {
  return gulp.src(['./src/*.ts'])
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('./dist'));
});
