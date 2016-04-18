var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
// var minifyHTML = require('gulp-minify-html');

// Minify CSS
gulp.task('minicss', function() {
  gulp.src('./public/stylesheets/*.css')
    .pipe(minifyCss())
    .pipe(concatCss('bundle.min.css'))
    .pipe(gulp.dest('./public/dist/stylesheets'));
});

// Minify JavaScript
gulp.task('minijs', function() {
  gulp.src('./public/javascripts/*.js')
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('./public/dist/javascripts'));
});

// Minify HTML
// gulp.task('minihtml', function() {
//   gulp.src('./src/index.html')
//     .pipe(minifyHTML())
//     .pipe(gulp.dest('./dist'));
// });

gulp.task('watch', function() {
  gulp.watch('./public/javascripts/*.js', ['minijs']);
  gulp.watch('./public/stylesheets/*.css', ['minicss']);
});

// Default
gulp.task('default', ['watch']);