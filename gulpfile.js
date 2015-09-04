'use strict';

var gulp = require('gulp'),
	  gutil = require('gulp-util'),
    path = require('path'),
    webserver = require('gulp-webserver'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    minhtml = require('gulp-minify-html'),
    imgmin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    jade = require('jade'),
    gulpjade = require('gulp-jade'),
    coffee = require('gulp-coffee'),
    fontmin = require('gulp-fontmin');

gulp.task('jade', function () {
	  gulp.src('builds/development/jade/index.jade')
    .pipe(gulpjade({     
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('builds/dist/'))
});

gulp.task('compass', function() {
  gulp.src('builds/development/sass/*.scss')
    .pipe(compass({
      project: path.join(__dirname, 'builds/development/'),
      css: '../dist/css',        
      sass: 'sass',
      image: '../dist/images'
    }))
    .on('error', gutil.log)

});

gulp.task('coffee', function() {
  gulp.src('builds/development/coffee/script.coffee')
    .pipe(coffee({ bare: true })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/dist/js/'))
});


gulp.task('images', function() {
  gulp.src('builds/development/images/**/*')
    .pipe(imgmin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    }))
   .pipe(gulp.dest('builds/dist/images/'))
});

gulp.task('fontmin', function () {
  gulp.src('builds/development/fonts/*.ttf')
    .pipe(fontmin({text: 'text'}))
    .pipe(gulp.dest('builds/dist/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('builds/development/images/**/*', ['images']);
  gulp.watch('builds/development/jade/**/*.jade', ['jade']);
  gulp.watch('builds/development/sass/**/*.scss', ['compass']);
  gulp.watch('builds/development/coffee/**/*.coffee', ['coffee']);
  gulp.watch('builds/development/fonts/*', ['fontmin']);

});

gulp.task('webserver', function() {
  gulp.src('builds/dist/')
      .pipe(webserver({
        livereload: true,
        open: true
      }));
});

gulp.task('default', [
  'images',
  'jade', 
  'compass', 
  'coffee',
  'fontmin',
  'webserver',
  'watch'
]);