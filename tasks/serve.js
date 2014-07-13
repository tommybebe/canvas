var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Watch Files For Changes & Reload
gulp.task('serve', ['wiredep', 'server'], function () {
  browserSync({
    notify: true,
    open: false,
    port: 9000,
    proxy: 'localhost:8000'
    // server: {
    //   baseDir: ['app', '.tmp']
    // }
  });

  gulp.watch(['app/index.html'], reload);
  gulp.watch(['app/partials/**/*.html'], ['templateCache']);
  // gulp.watch(['app/styles/**/*.scss'], ['styles:components', 'styles:scss']);
  gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
  gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css']);
  gulp.watch(['app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['app/scripts/templates.js'], ['jsReload']);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['server:dist'], function () {
  browserSync({
    notify: true,
    open: false,
    port: 9000,
    proxy: 'localhost:8000'
  });
});

gulp.task('server', ['wiredep', 'templateCache'], function(cb) {
  require('../server').exe(cb);
});
gulp.task('server:dist', ['default'], function(cb) {
  process.env.NODE_ENV = 'production';
  require('../dist/server').exe(cb);
});