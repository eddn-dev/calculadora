// gulpfile.js

const { src, dest, watch, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Rutas
const paths = {
  scss: 'src/scss/**/*.scss',
  js: ['src/js/**/*.js', '!src/js/**/*.jsx', '!src/js/**/*.tsx'],
  react: 'src/js/index.jsx', // Punto de entrada de React
  html: 'public/*.html',
};

// Tarea para compilar SCSS a CSS
function css() {
  return src(paths.scss)
    .pipe(gulpSass({ outputStyle: 'compressed' }).on('error', gulpSass.logError))
    .pipe(dest('./public/build/css'))
    .pipe(browserSync.stream());
}

// Tarea para transpilar y empaquetar React con Browserify y Babelify
function react() {
  return browserify({
    entries: [paths.react],
    extensions: ['.jsx'],
    debug: true,
  })
    .transform(
      babelify.configure({
        presets: ['@babel/preset-env', '@babel/preset-react'],
      })
    )
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('bundle.js')) // Nombre del archivo de salida
    .pipe(buffer())
    // Puedes agregar aquí plugins de Gulp para minificar si lo deseas
    .pipe(dest('./public/build/js'))
    .pipe(browserSync.stream());
}

// Tarea para procesar otros archivos JavaScript
function js() {
  return src(paths.js)
    .pipe(dest('./public/build/js'))
    .pipe(browserSync.stream());
}

// Inicializar BrowserSync
function browserSyncServe(cb) {
  browserSync.init({
    proxy: 'http://localhost:3000', // URL de tu servidor PHP
    open: true,
    port: 3001, // Puerto para BrowserSync
  });
  cb();
}


// Vigilar cambios en los archivos
function devWatch() {
  watch(paths.scss, css);
  watch(['src/js/**/*.jsx', 'src/js/**/*.js'], react);
  watch(paths.js, js);
  watch(paths.html).on('change', browserSync.reload);
}

// Exportar tareas
exports.css = css;
exports.react = react;
exports.js = js;
exports.dev = series(parallel(css, react, js), browserSyncServe, devWatch);
exports.default = exports.dev;
