//
// Прописаны таски для РАЗРАБОТКИ
//
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob'); /* подключает сразу несколько scss файлов */
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');
//
// Таска для удаления файлов с папки build перед новой сборкой проекта
//
gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
  }
  done();
});

// Объект настроек для Plumber Notify
const plumberNotify = title => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
};

// Объект настроек для gulp-imagemin
const svgminOptions = {
  plugins: [
    {
      name: 'removeViewBox',
      active: false,
    },
    {
      name: 'cleanupIDs',
      active: false,
    },
    {
      name: 'removeComments',
      active: true,
    },
    {
      name: 'removeEmptyContainers',
      active: true,
    },
  ],
};

// Объект настроек для svg sprita
const svgSpriteOptions = {
  mode: {
    symbol: {
      sprite: '../sprite.svg',
    },
  },
};

//
// Таска обрабатывает html файлы и подключает один файл в другой
//
gulp.task('html:dev', function () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./build/', { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude())
    .pipe(gulp.dest('./build/'));
});

//
// Таска компилит scss в css
//
gulp.task('sass:dev', function () {
  return (
    gulp
      .src('./src/scss/*.scss')
      .pipe(changed('./build/css/'))
      .pipe(plumber(plumberNotify('SCSS')))
      // добавляет исходные карты для css
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('./build/css/'))
  );
});

//
// Таска для копирования и минимизации изображений
//
gulp.task('images:dev', function () {
  return (
    gulp
      .src('./src/img/**/*')
      .pipe(newer('./build/img/')) /* проверяет на наличие новых img */
      .pipe(changed('./build/img/'))
      // .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest('./build/img/'))
  );
});

//
// Таска для минимизирования svg и создания спрайта
//
gulp.task('sprite:dev', function () {
  return gulp
    .src('./src/img/**/*.svg')
    .pipe(svgmin(svgminOptions))
    .pipe(svgSprite(svgSpriteOptions))
    .pipe(plumber(plumberNotify('Sprite SVG')))
    .pipe(gulp.dest('./build/img/icons/'));
});

//
// Таска для копирования шрифтов
//
gulp.task('fonts:dev', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'));
});

// Таска для копирования всех файлов с папки файлы
//
gulp.task('files:dev', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'));
});

//
// Таска для сбора js
//
gulp.task('js:dev', function () {
  return (
    gulp
      .src('./src/js/*.js')
      .pipe(changed('./build/js/'))
      .pipe(plumber(plumberNotify('JS')))
      // .pipe(babel())
      .pipe(webpack(require('./../webpack.config.js')))
      .pipe(gulp.dest('./build/js/'))
  );
});

//
// Таска для старта Live Server
//
const serverOptions = {
  livereload: true,
  open: true,
  port: 7070,
};

gulp.task('server:dev', function () {
  return gulp.src('./build/').pipe(server(serverOptions));
});

//
// Таска для отслеживания задач проекта и автоматической пересборки
//
gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/html/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/img/**/*.svg', gulp.parallel('sprite:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});
