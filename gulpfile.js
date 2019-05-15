// подключение установленных пакетов
// общие
const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
// css
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const normalize = require('node-normalize-scss').includePaths;
// js
const uglify = require('gulp-uglify-es').default;
// images
const imageMin = require('gulp-imagemin');

// создание объекта конфигурации
let config = {
    path: {
        scss: './src/scss/**/*.scss',
        js: './src/js/**/*.js',
        images: './src/images/**/*',
        html: './*.html',
    },
    output: {
        cssName: 'all.min.css',
        jsName: 'all.min.js',
        cssPath: './build/css',
        jsPath: './build/js',
        imagesPath: './build/images'
    }
};

// создание функций для выполнения задач
function styles() {
    return gulp.src(config.path.scss)
        .pipe(sass({
            includePaths: normalize
        }))
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(gulp.dest(config.output.cssPath))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(config.path.js)
        .pipe(concat(config.output.jsName))
        .pipe(uglify())
        .pipe(gulp.dest(config.output.jsPath))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(config.path.images)
        .pipe(imageMin())
        .pipe(gulp.dest(config.output.imagesPath))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(config.path.scss, styles);
    gulp.watch(config.path.js, scripts);
    gulp.watch(config.path.images, images);
    gulp.watch(config.path.html).on('change', browserSync.reload);
}

function clean() {
    return del(['build/*']);
}

// создание задач
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
                            gulp.parallel(styles, scripts, images)
                        ));

gulp.task('dev', gulp.series('build', 'watch'));