const gulp = require('gulp'),
      pump = require('pump'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      notify = require('gulp-notify');

gulp.task('build', function (finish) {
  pump([
    gulp.src('app/main.js'),
    babel({
      presets: ['env']
    }),
    uglify(),
    rename('main.min.js'),
    gulp.dest('dist/'),
    notify({
      title: 'Gulp',
      message: 'Script file has been compiled.'
    })
  ],finish);
})

gulp.task('default', ['build'], function () {
  gulp.watch('app/main.js',['build']);
})
