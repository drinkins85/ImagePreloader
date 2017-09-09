const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('example/js'))
);