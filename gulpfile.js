const gulp = require('gulp'),
      pump = require('pump'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      notify = require('gulp-notify'),
      browserify = require('browserify'),
      fs = require('fs'),
      footer = require('gulp-footer')

gulp.task('preprocess', () => {
  gulp.src('app/main.js')
      .pipe(rename('browser.js'))
      .pipe(footer('window.CDBDriver = cdbd;'))
      .pipe(gulp.dest('dist/bare/'))

  gulp.src('app/main.js')
      .pipe(rename('module.js'))
      .pipe(footer('module.exports = cdbd;'))
      .pipe(gulp.dest('dist/bare/'))
})

gulp.task('build', ['preprocess'], function () {
  browserify({
    entries: './dist/bare/browser.js',
    debug: true
  }).transform('babelify', {presets: ['env', ['minify',{
    mangle: false
  }]]}).bundle().pipe(fs.createWriteStream('dist/min/main.min.js'))

  notify({
    title: 'Gulp',
    message: 'Script has been compiled for Browsers.'
  })
})

gulp.task('default', ['build'], function () {
  gulp.watch('app/main.js',['build']);
})
