const gulp = require('gulp'),
      pump = require('pump'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      notify = require('gulp-notify'),
      browserify = require('browserify'),
      fs = require('fs');

gulp.task('build', function () {
  browserify({
    entries: './app/browser.js',
    debug: true
  }).transform('babelify', {presets: ['env', ['minify',{
    mangle: false
  }]]}).bundle().pipe(fs.createWriteStream('dist/main.min.js'))

  notify({
    title: 'Gulp',
    message: 'Script has been compiled for Browsers.'
  })
})

gulp.task('default', ['build'], function () {
  gulp.watch('app/main.js',['build']);
})
