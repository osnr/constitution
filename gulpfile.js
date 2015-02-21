/* gulpfile.js */

// Load some modules which are installed through NPM.
var gulp = require('gulp');

var del = require('del');  // Deletes files.

var browserify = require('browserify');  // Bundles JS.
var flow = require('gulp-flowtype'); // Typechecks.
var reactify = require('reactify');  // Transforms React JSX to JS.
var reactdown = require('reactdown/transform');
var source = require('vinyl-source-stream');

// var stylus = require('gulp-stylus');  // To compile Stylus CSS.

// Define some paths.
var paths = {
    css: ['src/css/*.css'],
    article_js: ['src/md/article.md'],
    app_js: ['./src/js/main.jsx'],
    js: ['src/js/*.jsx'],
};

// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.
gulp.task('clean', function(done) {
    del(['build'], done);
});

// Our CSS task. It finds all our Stylus files and compiles them.
// gulp.task('css', ['clean'], function() {
//   return gulp.src(paths.css)
//     .pipe(stylus())
//     .pipe(gulp.dest('./src/css'));
// });

gulp.task('typecheck', function() {
    return gulp.src(paths.js)
        .pipe(flow({
            all: false,
            weak: false,
            declarations: './declarations',
            killFlow: false,
            beep: true,
            abort: false
        }));
});

// Our JS task. It will typecheck, then Browserify our code
// and compile React JSX files.
gulp.task('js', ['clean'], function() {
    // Browserify/bundle the JS.
    browserify(paths.app_js)
        .transform(reactify, {stripTypes: true})
        .transform(reactdown)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./bin/'));
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
    // gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'js']);
