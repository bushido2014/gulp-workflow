const gulp           = require('gulp'),
		  gutil          = require('gulp-util' ),
		  sass           = require('gulp-sass'),
		  browserSync    = require('browser-sync'),
		  concat         = require('gulp-concat'),
		  uglify         = require('gulp-uglify'),
		  cleanCSS       = require('gulp-clean-css'),
		  rename         = require('gulp-rename'),
		  del            = require('del'),
		  imagemin       = require('gulp-imagemin'),
		  cache          = require('gulp-cache'),
		  autoprefixer   = require('gulp-autoprefixer'),
		  notify         = require("gulp-notify");



gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}));
});



gulp.task('js', function() {
	return gulp.src([
		'libs/jquery/dist/jquery.min.js',
		'js/common.js'
		
		])
	.pipe(concat('scripts.min.js'))
	//.pipe(uglify())
	.pipe(gulp.dest('js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './'
		},
		notify: false,
		
	});
});


gulp.task('imagemin', function() {
	return gulp.src('img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});


gulp.task('clean', async function() {
	return del.sync('dist'); 
});


gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'js/common.js'], gulp.parallel('js'));
	gulp.watch('*.html', browserSync.reload);

});

gulp.task('prebuild', async function() {

	let buildFiles = gulp.src([
		'*.html'
		]).pipe(gulp.dest('dist'));

	let buildCss = gulp.src([
		'css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	let buildJs = gulp.src([
		'js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	let buildFonts = gulp.src([
		'fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});


gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('build', gulp.parallel('prebuild', 'clean', 'imagemin', 'sass', 'js'));

gulp.task('default',gulp.parallel('watch', 'sass', 'js', 'browser-sync'));
