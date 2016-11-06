var gulp = require('gulp'),
    environments = require('gulp-environments'),
    del = require('del'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    changed = require('gulp-changed'),
    minimizer = require('gulp-imagemin'),
    size = require('gulp-size'),
    babel = require('gulp-babel'),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require('gulp-concat-js');

var production = environments.production;

gulp.task('styles', function () {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                './node_modules/bootstrap/scss'
            ],
            style: 'uncompressed',
            quiet: true
        }).on('error', sass.logError))
        .pipe(production(uncss({
            html: ['dist/**/*.html']
        })))
        .pipe(prefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(production(cleanCSS()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function () {
    return gulp.src([
            './node_modules/bootstrap/js/dist/util.js',
            './node_modules/bootstrap/js/dist/alert.js',
            './node_modules/bootstrap/js/dist/button.js',
            './node_modules/bootstrap/js/dist/carousel.js',
            './node_modules/bootstrap/js/dist/collapse.js',
            './node_modules/bootstrap/js/dist/dropdown.js',
            './node_modules/bootstrap/js/dist/modal.js',
            './node_modules/bootstrap/js/dist/scrollspy.js',
            './node_modules/bootstrap/js/dist/tab.js',
            './node_modules/bootstrap/js/dist/tooltip.js',
            './node_modules/bootstrap/js/dist/popover.js',
            './src/js/app.js'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat({
            "target": "app.js",
            "entry": "./src/js/app.js"
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    gulp.src('./src/**/**/*.html')
        .pipe(gulp.dest('dist/'))
});

gulp.task('images', function () {
    return gulp.src('src/img/**')
        .pipe(changed('dist/img'))
        .pipe(minimizer({progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/img'))
        .pipe(size({title: 'images'}));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./dist/",
            injectChanges: true,
            browser: "Google Chrome"
        }
    });
});

gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('watch', function () {
    gulp.watch("src/js/**/*.js", [browserSync.reload]);
    gulp.watch('src/**/*.html', ['html', browserSync.reload]);
    gulp.watch('src/scss/**/*.scss', ['styles', browserSync.reload]);
    gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});

gulp.task('default', function () {
    gulp.start('clean', 'styles', 'scripts', 'images', 'html', 'browser-sync', 'watch');
});
