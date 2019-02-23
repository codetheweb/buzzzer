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

// JS
gulp.task('js', () => {
  return gulp.src('src/main.js')
    .pipe(gulp.dest('dist'));
});

// HTML
gulp.task('html', () => {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

// Static assets
gulp.task('assets', () => {
  return gulp.src('src/assets/*')
    .pipe(gulp.dest('dist/assets/'));
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
  return del('dist/*');
});

// Basic dev build
gulp.task('build', gulp.parallel('sass', 'js', 'html', 'assets'));

// Browser sync reload
gulp.task('reload', done => {
  browserSync.reload();
  done();
})

// Build and reload
gulp.task('build:live', gulp.series('build', 'reload'));

// Production build with minification
gulp.task('build:production', gulp.series('build:clean', 'build', 'minify'));

// Watch
gulp.task('serve', gulp.series(gulp.series('build:clean', 'build:live'), () => {
    // Init Browsersync
    browserSync.init({
      watch: true,
      server: 'dist'
    });

    // Sass
    gulp.watch('src/main.scss', gulp.series('sass'));

    // HTML
    gulp.watch('src/index.html', gulp.series('build:live'));

    // JS
    gulp.watch('src/main.js', gulp.series('build:live'));
}));
