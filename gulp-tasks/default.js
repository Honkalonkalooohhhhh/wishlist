const gulp = require('gulp');

module.exports = function() {
    return gulp.start([
        'script',
        'style'
    ]);
};