"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");

var copy = require('gulp-contrib-copy');
var clean = require('gulp-contrib-clean');

var server = require("browser-sync");

var uglify = require('gulp-uglify');

var uncss = require('gulp-uncss');
var concat = require('gulp-concat');

gulp.task("images", function() {
    return gulp.src("img/**/*.{png,jpg,gif}")
      .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("style", function() {
  gulp.src("css/**/*.css")
    .pipe(plumber())
    .pipe(concat('main.css'))
    .pipe(uncss({
        html: ['index.html']
    }))
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"))

    .pipe(server.reload({stream: true}));
});

gulp.task('compress', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task("clean", function() {
  gulp.src('build', {read: false})
    .pipe(clean())
  });

gulp.task("copy", function() {
  gulp.src("*.html").pipe(gulp.dest("build"));
  gulp.src("img/**.{png,jpg,gif,svg}").pipe(gulp.dest("build/img"));
  gulp.src("js/**.js").pipe(gulp.dest("build/js"));
  gulp.src("font-awesome/*/**.*").pipe(gulp.dest("build/font-awesome"));
  gulp.src("fonts/**.*").pipe(gulp.dest("build/fonts"));
  gulp.src("mail/**.*").pipe(gulp.dest("build/mail"));
});

gulp.task("serve", function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("js/*.js").on("change", server.reload);
  gulp.watch("*.html").on("change", server.reload);
  gulp.watch("css/*.css").on("change", server.reload);
});


gulp.task("build", ["clean", "style", "images", "compress", "copy"], function() {
});
