const gulp = require('gulp');

module.exports = function() {
    gulp.start('default');

    gulp.watch([
        'src/js/**/*.js'
    ], ['script']);

    gulp.watch([
        'src/scss/**/*.scss'
    ], ['style']);
};
