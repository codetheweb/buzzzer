const gulp = require('gulp');
const del = require('del');

// Plugins
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const htmlmin = require('gulp-htmlmin');

// Sass
gulp.task('sass', () => {
  return gulp.src('src/main.scss')
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// HTML
gulp.task('html', () => {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

// Static assets
gulp.task('assets', () => {
  return gulp.src('src/assets/*')
    .pipe(gulp.dest('dist'));
});

// Minify
gulp.task('minify', () => {
  return gulp.src('dist/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'));
});

// Clean dist folder
gulp.task('build:clean', () => {
  return del.sync('dist/*');
});

// Basic dev build
gulp.task('build', gulp.parallel('sass', 'html', 'assets'));

// Build and reload
gulp.task('build:live', (callback) => {
  runSequence('build', () => {
    browserSync.reload();
    callback();
  });
});

// Production build with minification
gulp.task('build:production', gulp.series('build:clean', 'build', 'minify'));

// Watch
gulp.task('serve', gulp.series('build:clean', 'build:live', () => {
    // Init Browsersync
    browserSync.init({
      server: 'dist'
    });

    // Sass
    gulp.watch('src/main.scss', ['sass']);

    // HTML
    gulp.watch('src/index.html', ['build:live']);
}));
