var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

function compile(watch) {
  var bundler = watchify(browserify('assets/script/main.js', { debug: true })
    .transform(babel.configure({presets: ["es2015"]})))

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript'))
      .pipe(livereload());
  }

  if (watch) {
    bundler.on('update', function () {
        console.log('-> bundling...');
        rebundle();
    });

    rebundle()
  } else {
    rebundle().pipe(exit());
  }
}

function watch() {
  return compile(true);
};

gulp.task('sass', function () {
  return gulp.src('assets/styles/main.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(concat('app.css'))
    .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('assets/styles/**/*.scss', ['sass']);
  watch();
});

gulp.task('default', ['watch']);
