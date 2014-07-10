'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var templateCache = require('gulp-angular-templatecache');
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('templateCache', function () {
  gulp.src('app/partials/**/*.html')
    .pipe(templateCache({module: 'config', root: 'partials'}))
    .pipe(gulp.dest('app/scripts'));
});

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/public/images'))
    .pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
  gulp.src(['server/**/*'])
    .pipe(gulp.dest('dist/server'))
    .pipe($.size({title: 'copy:server'}));
  gulp.src(['server.js', 'package.json'])
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy:server.js'}));
  gulp.src(['app/fonts/**/*'])
    .pipe(gulp.dest('dist/public/fonts'))
    .pipe($.size({title: 'copy:fonts'}));
  return gulp.src(['app/*', '!app/*.html'])
    .pipe(gulp.dest('dist/public'))
    .pipe($.size({title: 'copy'}));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
  return gulp.src('app/styles/**/*.css')
    .pipe($.changed('app/styles'))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('app/styles'))
    .pipe($.size({title: 'styles:css'}));
});

// Compile Sass For Style Guide Components (app/styles/components)
// gulp.task('styles:components', function () {
//   return gulp.src('app/styles/components/components.scss')
//     .pipe($.rubySass({
//       style: 'expanded',
//       precision: 10,
//       loadPath: ['app/styles/components']
//     }))
//     .on('error', console.error.bind(console))
//     .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
//     .pipe(gulp.dest('app/styles/components'))
//     .pipe($.size({title: 'styles:components'}));
// });

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
  return gulp.src(['app/styles/**/*.scss'])
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/styles']
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size({title: 'styles:scss'}))
    .pipe(browserSync.reload({ stream: true }));
});

// Output Final CSS Styles
// gulp.task('styles', ['styles:components', 'styles:scss', 'styles:css']);
gulp.task('styles', ['styles:scss', 'styles:css']);

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', ['templateCache'], function () {
  return gulp.src('app/index.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some', mangle: false})))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    // .pipe($.if('*.css', $.uncss({
    //   html: [
    //     'app/index.html',
    //     'app/styleguide/index.html'
    //   ],
    //   // CSS Selectors for UnCSS to ignore
    //   ignore: [
    //     '.navdrawer-container.open',
    //     /.app-bar.open/
    //   ]
    // })))
    .pipe($.useref.restore())
    .pipe($.useref())
    // Update Production Style Guide Paths
    // .pipe($.replace('components/components.css', 'components/main.min.css'))
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml({empty: true, conditionals:true, spare: true})))
    // Output Files
    .pipe(gulp.dest('dist/public'))
    .pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.sass-cache', '.tmp', 'dist/*', '!dist/.git']));

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});