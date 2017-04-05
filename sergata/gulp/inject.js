'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
    browserSync.reload();
});

gulp.task('inject', ['scripts'], function () {
    var injectStyles = gulp.src([
        path.join(conf.paths.src, '/styles/**/*.css')
    ], {read: false});

    var injectScripts = gulp.src([
        path.join(conf.paths.src, '/app/**/app.module.js'),
        path.join(conf.paths.src, '/app/**/*.module.js'),
        path.join(conf.paths.src, '/app/**/*.js'),
    ])
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

    var injectOptions = {
        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: true,
        order: ['**/app.module.js', '**/*.module.js', '**/*.js']
    };

    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});