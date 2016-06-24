var gulp = require("gulp");
var ts = require("gulp-typescript");
var del = require('del');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var tsProject = ts.createProject("tsconfig.json");

// clean dist folder
gulp.task("clean", function(){
  return del([
    'dist/*'
  ])
});
gulp.task("default", ['clean'], function () {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['src/Site.ts', 'src/Target.ts', 'src/KiiApp.ts', 'src/TypeID.ts', 'src/APIAuthor.ts'],
      cache: {},
      packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('thing-if-sdk.js'))
  .pipe(gulp.dest("dist"));});
