const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const gutil = require('gulp-util');

module.exports = function() {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber())
        .pipe(sass().on('error', function(error){
            gutil.log(error.message);
            this.emit('end');
        }))
        .pipe(autoprefixer({browsers: ['last 2 version'], remove: false}))
        .pipe(rename({ basename: 'babylist'}))
        .pipe(gulp.dest('build/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'))
        .pipe(notify('DONE STYLE'));
};