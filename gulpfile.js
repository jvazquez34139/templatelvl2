"use strict";

const gulp = require('gulp'),
  {task, src, dest, series, parallel, watch} = gulp,
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  maps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  imageMin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create(),
  del = require('del');

const concatScripts = () => {
  return src([
      'public/js/ideasjq.js'
      // 'public/js/script2.js',
      // 'public/js/script3.js'
    ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(dest('public/js'));
}

const minifyJS = () => {
  return src('public/js/app.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(dest('public/js'));
}

const compileSass = () => {
  return src('public/scss/main.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(dest('public/css'));
}

const minifyCSS = () => {
  return src('public/css/main.css')
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(dest('public/css'));
}

const clearCSS = () => {
  return del(['public/css']);
}
const clearJS = () => {
  return del(['public/js/app*.js*']);
}
const clean = () => {
  return del(['dist','public/images','public/css*','public/js/app*.js*']);
}

const watchCSS = () => {
  watch(['public/scss/**/*.scss'], series('minifyCSS'))
}

const watchFiles = () => {
  browserSync.init({
    port:3001,
    proxy: "localhost:3000"
    //run server before attempting to run this proxy
  });
  watch(['public/scss/**/*.scss']).on('change', series('clearCSS','minifyCSS', browserSync.reload));
  watch(['public/js/**/*.js']).on('change', series('clearJS','concatScripts', browserSync.reload));
  watch(['views/**/*.pug']).on('change', browserSync.reload);
}

const build = () => {
  return src([
      "public/css/main.min.css",
      "public/js/app.min.js",
      "public/images",
      "routes",
      "views",
      "license.txt",
      "package.json",
      "app.js"
    ], {base: "./"})
  .pipe(dest('dist'));
}

const sanity = () => {
  console.log('testing gulp');
}

task('test', sanity);
task('concatScripts', series(clearJS, concatScripts));
task('minifyJS', series('concatScripts', minifyJS));
task('compileSass', series(clearCSS, compileSass));
task('minifyCSS', series('compileSass', minifyCSS));
task('watchCSS', watchCSS);
task('watchFiles', watchFiles);
task('clearJS',clearJS);
task('clearCSS', clearCSS);
task('clean', clean);
task('default', series('clean', parallel('minifyCSS', 'minifyJS'), build));
