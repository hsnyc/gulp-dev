// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const image = require('gulp-image');
const jshint = require('gulp-jshint');
const browserSync = require('browser-sync').create();
var replace = require('gulp-replace');

//theme name
var themename = 'dci';

var root = '../' + themename + '/',
    scss = root + 'sass/',
	  js = root + 'js/',
	  img = root + 'images/',
	  languages = root + 'languages/';

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
  return src(scss + '{style.scss,rtl.scss}')
      .pipe(sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass({
        outputStyle: 'expanded', 
        indentType: 'tab',
        indentWidth: '1'
      }).on('error', sass.logError)) // compile SCSS to CSS
      .pipe(postcss([
        autoprefixer('last 2 versions', '> 1%')
      ]))
      .pipe(sourcemaps.write(scss + 'maps'))
	    .pipe(dest(root));
}

// JS task: concatenates files to main.js and uglifies on prod
function jsTask(){
  return src([js + '*.js'])
  .pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(dest(js));
}

// Image task: optimize images for production
function imgTask(){
  return src(img + 'RAW/**/*.{jpg,JPG,png}')
  .pipe(newer(img))
	.pipe(image())
	.pipe(dest(img));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
  browserSync.init({ 
		open: false,
		proxy: 'dci.local',
		port: 8080
	});
	watch(scss + '*.scss', scssTask);
	watch(js + '**/*.js', jsTask);
	watch(img + 'RAW/**/*.{jpg,JPG,png}', imgTask);
  watch(root + '**/*').on('change', browserSync.reload);
};
 

exports.default = watchTask;