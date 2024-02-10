//
// Прописаны таски для ПРОДАКШЕНА
//
const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
// const webpHTML = require('gulp-webp-html');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const rename = require('gulp-rename');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const realFavicon = require('gulp-real-favicon');

// SVG
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');

//
// Таска для удаления файлов с папки docs перед новой сборкой проекта
//
gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
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
gulp.task('html:docs', function () {
  return (
    gulp
      .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
      .pipe(changed('./docs/'))
      .pipe(plumber(plumberNotify('HTML')))
      .pipe(fileInclude())
      .pipe(
        realFavicon.injectFaviconMarkups(
          JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code,
        ),
      )
      // .pipe(webpHTML())
      .pipe(htmlclean())
      .pipe(gulp.dest('./docs/'))
  );
});

//
// Таска компилит scss в css
//
gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./docs/css/'));
});

//
// Таска для копирования и минимизации изображений
//
gulp.task('images:docs', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'));
});

//
// Таска для минимизирования svg и создания спрайта
//
gulp.task('sprite:docs', function () {
  return gulp
    .src('./src/img/**/*.svg')
    .pipe(svgmin(svgminOptions))
    .pipe(svgSprite(svgSpriteOptions))
    .pipe(plumber(plumberNotify('Sprite SVG')))
    .pipe(gulp.dest('./docs/img/icons/'));
});

//
// Таска для копирования шрифтов
//
gulp.task('fonts:docs', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'));
});

// Таска для копирования всех файлов с папки файлы
//
gulp.task('files:docs', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'));
});

//
// Таска для сбора js
//
gulp.task('js:docs', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js/'));
});

// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
gulp.task('generate-favicon:docs', function (done) {
  realFavicon.generateFavicon(
    {
      masterPicture: './src/img/favicon/favicon.png',
      dest: './docs/img/favicon',
      iconsPath: './img/favicon',
      design: {
        ios: {
          pictureAspect: 'backgroundAndMargin',
          backgroundColor: '#e8ffff',
          margin: '14%',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: 'background',
          backgroundColor: '#e8ffff',
          backgroundRadius: 0.45,
          imageScale: 0.9,
        },
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#e8ffff',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: 'backgroundAndMargin',
          margin: '17%',
          backgroundColor: '#e8ffff',
          themeColor: '#e8ffff',
          manifest: {
            name: 'Beauty Zone',
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: 'silhouette',
          themeColor: '#5bbad5',
        },
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    function () {
      done();
    },
  );
});

//
// Таска для старта Live Server
//
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server:docs', function () {
  return gulp.src('./docs/').pipe(server(serverOptions));
});
