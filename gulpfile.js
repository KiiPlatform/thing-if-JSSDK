var gulp = require("gulp");
var del = require('del');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var typedoc = require("gulp-typedoc");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");

console.log(tsProject);
// clean dist folder
gulp.task("clean", function(){
  return del([
    'dist/*'
  ])
});
gulp.task("doc", function() {
  	return tsProject.src()
		.pipe(typedoc({
			module: "commonjs",
			target: "es5",
			includeDeclarations: false,
			out: "./doc",
			name: "thing-if-sdk",
      externalPattern: "./src/ops/*.ts",
      excludeExternals: true,
			ignoreCompilerErrors: false,
			version: true,
		}))
	;
})
gulp.task("default", ['clean'], function () {
  return gulp.src(['./src/*.ts'])
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('./dist'));
});
