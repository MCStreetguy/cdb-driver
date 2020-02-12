const gulp = require('gulp'),
      pump = require('pump'),
      babel = require('gulp-babel'),
      rename = require('gulp-rename'),
      notify = require('gulp-notify')

gulp.task('build', (finish) => {
  pump([
    gulp.src('app/browser.js'),
    rename('main.min.js'),
    babel({presets: [
      '@babel/env',
      'minify'
    ]}),
    gulp.dest('dist/'),
    notify({
      title: 'Gulp',
      message: 'Script has been compiled for Browsers.'
    })
  ],finish)
})

gulp.task('default', gulp.series('build', function () {
  gulp.watch('app/main.js', gulp.series('build'));
}))
