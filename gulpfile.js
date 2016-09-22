// -------------------------------------------------------------
// This file contains gulp tasks, and is primarily used for
// compiling assets.
// -------------------------------------------------------------

const gulp        = require('gulp');
const flatten     = require('gulp-flatten');
const gutil       = require('gulp-util');
const browserify  = require('browserify');
const minifyify   = require('minifyify');
const watchify    = require('watchify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const livereload  = require('gulp-livereload');
const reactify    = require('reactify');
const envify      = require('envify');
const _           = require('lodash');
const del         = require('del');
const preprocess  = require('gulp-preprocess');

// Check environment vars, e.g.
// ASSET_URL=http://spirit-dev.kakushin.io API_URL=http://spirit-dev-api.kakushin.io gulp dev
if (_.isEmpty(process.env.ASSET_URL) || _.isEmpty(process.env.API_URL)) {
    throw new Error('Environment vars ASSET_URL and API_URL must be set');
}

// Move our fonts
gulp.task('fonts', function (callback) {
    gulp.src(['./fonts/*'])
        .pipe(gulp.dest('./build'))
        .on('end', callback);
});

// Move our images
gulp.task('images', function (callback) {
    gulp.src(['./images/**/*'])
        .pipe(flatten()) // Flatten the directory structure so we don't get the sub directories in the output
        .pipe(gulp.dest('./build'))
        .on('end', callback);
});

gulp.task('clean:js', function (callback) {
    del('./build/*.js*').then(function () { callback(); });
});

gulp.task('html', function () {
    gulp.src('./html/*')
        // Put the asset URL for static assets through the preprocessor to get the correct URL
        .pipe(preprocess({ context: { ASSET_URL: process.env.ASSET_URL } }))
        .pipe(gulp.dest('./build'));
});

// Copy any js libraries that are only for dev into the build folder
gulp.task('dev:js', ['clean:js'], function () {
    gulp.src('./js/dev/*')
    .pipe(gulp.dest('./build'));
});

const browserifyOptions = {
    entries: ['./js/application.js'],
    transform: [reactify, envify],
    debug: true
};

// -------------------------------------------------------------
// Task gulp dev is used to compile assets on dev, set up the
// livereload server and watch the disk for file changes.
// -------------------------------------------------------------

gulp.task('dev', ['fonts', 'images', 'html', 'dev:js'], function (callback) {
    // Use watchify to efficiently watch changes to js files on disk and recompile
    // Use the options exported by watchify - they're require by browserify to make watching work correctly
    const opts = _.extend({}, watchify.args, browserifyOptions);

    // Set up watchify to poll every 500ms, cause watching via inotify doesn't work on symlinked volumes used by docker.
    const bundler = watchify(browserify(opts), {
        poll: 500
    });

    bundler.plugin('minifyify', {
        map: '/application.js.map',
        output: './build/application.js.map'
    });

    const bundle = function () {
        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('application.js'))
            .pipe(buffer())
            .pipe(gulp.dest('./build'))
            .pipe(livereload());
    };

    bundle();

    // Pipe the logs from browserify into the gulp logs
    bundler.on('log', gutil.log);
    // Watch for changes to JS
    bundler.on('update', bundle);

    // Enable livereload to reload changes in the browser automatically
    livereload.listen({
        'port': 35729,
        'start': true
    });
});

// -------------------------------------------------------------
// Task gulp assets:sync will take the build folder and synchronize
// the assets inside with a corresponding s3 bucket. Pass the command line
// argument --asset_hash to select the correct bucket.
// -------------------------------------------------------------

// Compile assets with production flags, then move the build directory to the s3 bucket
gulp.task('assets:push', function (callback) {
    var child_process = require('child_process');
    // Run the AWS command line tool to sync the directory to s3
    var child = child_process.spawn('aws', ['s3', 'cp', 'build', 's3://' + process.env.S3_BUCKET_NAME, '--recursive'], []);
    // Pipe the stdout of the child process so we can see it on the command line
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        process.stdout.write(data);
    });
    // Pipe the stderr of the child process so we can see it on the command line
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        process.stderr.write(data);
    });
    child.on('exit', function () {
        callback();
        process.exit();
    });
});

// -------------------------------------------------------------
// Task gulp build will build all the assets and then terminate.
// -------------------------------------------------------------

// Build the application.js file
gulp.task('build:js:production', ['clean:js'], function () {
    // Initialize browserify for compiling JS
    const bundler = browserify(browserifyOptions);

    // Use the minifyify plugin to obfuscate and compress js
    bundler.plugin('minifyify', { map: false });

    // Run the bundle
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('application.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./build'));
});

gulp.task('build', ['fonts', 'images', 'html', 'build:js:production'], function (callback) {
    callback();
    process.exit();
});
