const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
    gulp.src('src/index.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('build'))
);