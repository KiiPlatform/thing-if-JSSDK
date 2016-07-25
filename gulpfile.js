var gulp = require("gulp");
var del = require('del');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var shell = require('gulp-shell');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");

console.log(tsProject);
// clean dist folder
gulp.task("clean", function(){
  return del([
    'dist/*'
  ])
});

gulp.task("doc",['build-for-doc'],  shell.task([
	'rm -fr jsdoc/html',
	'jsdoc built-for-doc -c jsdoc/conf.json -R README.md'
]))
gulp.task("build-for-doc", function() {
  	return gulp.src(['./src/*.ts', "./typings/globals/node/index.d.ts"])
		.pipe(ts({
			noImplicitAny: true,
			module: "commonjs",
			target: "es6",
			removeComments: false,
		}))
		.js.pipe(gulp.dest('built-for-doc'));
})
gulp.task("default", ['clean'], function () {
  return gulp.src(['./src/*.ts'])
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('./dist'));
});
