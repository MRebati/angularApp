var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    w3cjs = require('gulp-w3cjs'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    path = require('path');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = 'development';

// if (env==='development') {
//   outputDir = 'builds/Development/';
//   sassStyle = 'expanded';
// } else {
//   outputDir = 'builds/Production/';
//   sassStyle = 'compressed';
// }

outputDir = '';

jsSources = ['assets/js/*.js','!./node_modules/**','!./assets/libs/**'];
sassSources = ['assets/sass/style.scss'];
htmlSources = [outputDir + '*/*.html'];

gulp.task('js', function() {
  'use strict';

  gulp.src('assets/js/script.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'assets/scripts'))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
  'use strict';
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'assets/sass',
      css: 'assets/css',
      image: 'assets/img',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  'use strict';
  gulp.watch(jsSources, ['js']);
  gulp.watch(['assets/sass/*.scss', 'assets/sass/*/*.scss'], ['compass']);
  gulp.watch('*/*.html', ['html']);
});

gulp.task('connect', function() {
  'use strict';
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  'use strict';
  gulp.src('*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload());
});

// Copy images to production
gulp.task('move', function() {
  'use strict';
  gulp.src('assets/img/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'assets/img')));
});

gulp.task('default', ['watch', 'html', 'js', 'compass', 'move', 'connect']);
