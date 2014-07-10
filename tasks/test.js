'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep');

// e2e test
gulp.task('e2e', ['server'], function(cb){
  gulp.src(['tests/*.js'])
    .pipe($.protractor.protractor({
      configFile: 'test/protractor-conf.js'
    }))
    .on('end', function() {
      server.close();
      cb();
    });
});

// unit test
gulp.task('unit', function() {
  var bowerDeps = wiredep({
    directory: 'app/bower_components',
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    'app/scripts/**/*.js',
    'test/unit/**/*.js'
  ]);

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});