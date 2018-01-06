/* jshint node: true */
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('test', function () {
  return gulp.src('app/test/**/*.html')
  .pipe(plumber())
  .pipe(mochaPhantomJS({silent: true}));
});

gulp.task('watch:test', ['test'], function() {
  gulp.watch('./app/scripts/**/*.js', ['test']);
  gulp.watch('./app/test/**/*.{js,html}', ['test']);
});

gulp.task('default', ['watch:test']);
