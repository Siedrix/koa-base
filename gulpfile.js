var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");

var webpack  = require('webpack');

var livereload = require('gulp-livereload');
var config = require('./webpack.config');

gulp.task('reload', function (callback) {
	console.log('reloading');
	return gulp.src('frontend/main.jsx').pipe( livereload() );
});

gulp.task("webpack", function(callback) {
	// run webpack
	webpack({
		entry: './frontend/main.jsx',
		output: {
			filename: 'public/js/build/main.js',
			sourceMapFilename:'[file].map'
		},
		devtool: "source-map",
		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel'
				}
			],
		}
	}, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		var statsAsString = stats.toString({});

		gutil.log("[webpack]", statsAsString.split('chunk')[0]);
		// livereload({ start: true })
		// console.log('Should reload', livereload());
		livereload.changed('public/js/main.js');
		callback();
	});
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch([
		'frontend/*.jsx',
		'frontend/widgets/*.jsx',
		'frontend/data/*.js'
	], ['webpack']);
	gulp.watch(['public/css/app.css'], ['reload']);
});