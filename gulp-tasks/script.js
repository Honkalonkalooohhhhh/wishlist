const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

module.exports = function() {
    return gulp.src([
        'src/js/**/*.js'
    ])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(concat('babylist.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(notify('DONE SCRIPT'));
};