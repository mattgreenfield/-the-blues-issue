// Gulp Config File

//
// VARIABLES
//

var gulp = require('gulp'),

    // Sass
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),

    // Image optimizing
    imagemin = require('gulp-imagemin'),
    gm = require('gulp-gm'),
    // pngquant = require('imagemin-pngquant'),
    // jpegtran = require('imagemin-jpegtran'),
    // gifsicle = require('imagemin-gifsicle'),
    // optipng = require('imagemin-optipng'),
    webp = require('gulp-webp'),
    imageResize = require('gulp-image-resize'),
    changeCase = require('change-case'),


    // Scripts
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),

    // Serving to localhost
    express = require('express'),

    shell = require('gulp-shell'),

    // Error handling, hmmmm.....
    notify = require("gulp-notify"),
    plumber = require('gulp-plumber'),

    // Critical Path CSS
    penthouse = require('penthouse'), // For creating the critical path css
    fs = require('fs'), // for writing the css to a jekyll include

    // Reports
    a11y = require('gulp-a11y'),

    // Live reload
    livereload = require('gulp-livereload');


// Paths
var paths = {
    scripts: [
        'node_modules/baguettebox.js/src/baguetteBox.js',
        'node_modules/lazysizes/lazysizes.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/moment/moment.js',
        'scripts/*.js'
    ],
    images: ['images/**/*.jpg'],
    styles: ['styles.scss']
};

var port = 4000;


//
// TASKS
//

// Task: Sass
gulp.task('sass', function () {

    gulp.src(paths.styles)
    .pipe(sass({style: 'compressed'}))
    .pipe(prefix(["last 1 version", "> 1%", "ie 8", "ie 7"],{map: false }))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))

    // Place in dest folder
    .pipe(gulp.dest('../assets/css/'))
    .pipe(gulp.dest('../_site/assets/css/')); // Copy to static dir to avoid jekyll having to run again just to copy it over

    // .pipe(livereload())
});

// Task: Scripts
gulp.task('scripts', function() {
    gulp.src(paths.scripts)
    .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
            title: "Gulp error in " + err.plugin,
            message:  err.toString()
        })(err);
    }}))
    // .pipe(sourcemaps.init())
    .pipe(babel({
        ignore: ['baguetteBox.js', 'moment.js'],
        presets: ['env']
    }))
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write('.'))

    .pipe(gulp.dest('../assets/js'))
    .pipe(gulp.dest('../_site/assets/scripts/')); // Copy to static dir to avoid jekyll having to run again just to copy it over
});

// Task: Jekyll
// Run jekyll and put the files in the `_/site` directory
gulp.task('jekyll', shell.task([
  'jekyll build --config _dev-config.yml --source ../ --destination ../_site',
]));


// Task: Serve
// serve the `_site/` directory jekyll creates on to http://localhost:4000/
gulp.task('serve', function () {
    var app = express();
    app.use(express.static('../_site'));
    app.listen( port );
    console.log('-- The site can be viewed at localhost:' + port + ' --');
});

// Task: Penthouse
// Critical Path CSS
gulp.task('penthouse', function() {
	// index
    penthouse({
        url : 'http://localhost:4000/index.html',
        css : '../_site/assets/css/styles.min.css',
        width: 1920, // viewport width
        height: 1080 // viewport height
    }, function(err, criticalCss) {
        // console.log(criticalCss);
        console.log(err);
        fs.writeFile('../_includes/index-critical-css.html', criticalCss); // Write the contents to a jekyll include
    });
	// blog
	penthouse({
		url : 'http://localhost:4000/blog/index.html',
		css : '../_site/assets/css/styles.min.css',
		width: 1920, // viewport width
		height: 1080 // viewport height
	}, function(err, criticalCss) {
		// console.log(criticalCss);
		console.log(err);
		fs.writeFile('../_includes/posts-critical-css.html', criticalCss); // Write the contents to a jekyll include
	});
});


// Task: Images

gulp.task('makeJpg', function () {
    gulp.src('images/**/*.png')
    .pipe(plumber())
    .pipe(gm(function (gmfile) {
        return gmfile.setFormat('jpg');
    }))
    .pipe(gulp.dest('images/'))
});
gulp.task('makeThumbs', function () {
    return gulp.src('images/archive/*')
    .pipe(imageResize({
        width : 616 // 35em, set for text readability
    }))
    .pipe(imagemin())
    // .pipe(gulp.dest('../assets/img/archive/thumb/'))
    // .pipe(webp())
    .pipe(gulp.dest('../assets/img/archive/thumb/'))
});
gulp.task('imageOptim', function () {
    gulp.src('images/*.jpg, images/**/*.jpg')
    .pipe(imageResize({
        width: 1000 // max width
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('../assets/img/'))
});
gulp.task('moveBg', function () {
    gulp.src('images/home-bg.jpg')
    .pipe(imagemin())
    .pipe(gulp.dest('../assets/img/'))
});
gulp.task('moveSVG', function () {
    return gulp.src('images/*.svg')
        .pipe(gulp.dest('../assets/img/'))
});

gulp.task('images', ['makeJpg', 'imageOptim', 'makeThumbs', 'moveSVG']);


// icons
gulp.task('icons', function () {
    return gulp.src('icons/*.svg')
        .pipe(gulp.dest('../assets/icons/'))
});

// Task: a11y
gulp.task('a11y', function () {
  return gulp.src('../_site/**.html')
    .pipe(a11y())
    .pipe(a11y.reporter());
});

// Watch for changes
gulp.task('watch', ['serve'], function () {

    livereload.listen();

	// run the sass and penthouse task when path.styles are changed
    gulp.watch((paths.styles), ['sass','penthouse']);

	// run the scripts task when path.scripts are changed
    gulp.watch((paths.scripts), ['scripts']);

    // Run jekyll when a file html or markdown file is changed
    // MAKE SURE that the last two items in the watchlist are included or else infinite jekyll loop
    gulp.watch(['../*.html', '../*/*.html', '../*/*.md', '!../_site/**', '!../_site/*/**'], ['jekyll']);


});


gulp.task('default', ['sass', 'penthouse', 'scripts', 'images', 'jekyll', 'serve', 'watch']);
gulp.task('optimise', ['jekyll', 'serve', 'penthouse', 'images' ]);
gulp.task('reports', ['a11y' ]);
