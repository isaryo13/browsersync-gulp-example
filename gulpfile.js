const { watch, series, task, src, dest, parallel } = require('gulp');
const del = require('del');
const notify  = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass    = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify  = require('gulp-uglify');
const browserSync = require('browser-sync');

const SRC_HTML = './src/**/*.html';
const SRC_CSS  = './src/**/*.css';
const SRC_SCSS = './src/**/*.scss';
const SRC_JS   = './src/**/*.js';
const SRC_IMG  = './src/**/*.+(png|jpg|jpeg|gif|svg)';
const DIST = './dist/';

task('clean', () => {
  return del(DIST, { force: true });
});

task('html', () => {
  return src(SRC_HTML)
    .pipe(dest(DIST))
});

task('css', () => {
  return src(SRC_CSS)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(autoprefixer({
      browsers: ['ie >= 11'],
      cascade: false,
      grid: true
    }))
    .pipe(dest(DIST));
});

task('scss', () => {
  return src(SRC_SCSS)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['ie >= 11'],
      cascade: false,
      grid: true
    }))
    .pipe(dest(DIST));
});

task('js', () => {
  return src(SRC_JS)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(dest(DIST));
});

task('images', () => {
  return src(SRC_IMG)
    .pipe(dest(DIST))
});

task('browser-sync', () => {
  return browserSync.init({
    server: {
      baseDir: DIST
    },
    port: 3000,
    reloadOnRestart: true,
    tunnel: true
  });
});

task('reload', (done) => {
  browserSync.reload();
  done();
});

task('watch', (done) => {
  watch([SRC_HTML], series('html', 'reload'));
  watch([SRC_CSS], series('css', 'reload'));
  watch([SRC_SCSS], series('scss', 'reload'));
  watch([SRC_JS], series('js', 'reload'));
  watch([SRC_IMG], series('images', 'reload'));
  done();
});

task('build', parallel('html', 'css', 'scss', 'js', 'images'));

task('default', series('clean', 'build', parallel('watch', 'browser-sync')));
