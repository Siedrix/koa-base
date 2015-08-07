var _ = require('underscore')
var path = require('path')

var gulp = require('gulp')
var eslint = require('gulp-eslint')
var gutil = require('gulp-util')
var CompressionPlugin = require('compression-webpack-plugin')

var webpack = require('webpack')

var livereload = require('gulp-livereload')

gulp.task('reload', function (callback) {
	console.log('reloading')
	return gulp.src('frontend/main.jsx').pipe( livereload() )
})

var node_modules_dir = path.join(__dirname, 'node_modules')
var webpackConfig = {
	entry: {
		vendor: ['react', 'Backbone', 'backbone-react-component', 'jquery', 'underscore', 'moment'],
		main: './frontend/main.jsx',
		profile: './frontend/profile.jsx'
	},
	output: {
		filename: 'public/js/build/[name].js',
		sourceMapFilename: '[file].map'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'public/js/build/vendor.js')
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel'
			}
		]
	}
}

gulp.task('webpack', function (callback) {
	// run webpack
	var configClone = _.extend({}, webpackConfig)
	configClone.devtool = ['source-map']

	webpack(configClone, function (err, stats) {
		if (err) { throw new gutil.PluginError('webpack', err) }
		var statsAsString = stats.toString({})

		gutil.log('[webpack]', statsAsString.split('chunk')[0])
		livereload.changed('public/js/main.js')
		callback()
	})
})

// Production ready files
gulp.task('compile-for-production', function (callback) {
	// run webpack
	var configClone = _.extend({}, webpackConfig)

	configClone.plugins.push( new webpack.optimize.UglifyJsPlugin({minimize: true}) )
	configClone.plugins.push( new CompressionPlugin({
		asset: '{file}.gz',
		algorithm: 'gzip',
		regExp: /\.js$|\.html$/,
		threshold: 500,
		minRatio: 0.8
	}) )

	configClone.resolve = {alias: {}}
	configClone.module.noParse = []

	var deps = [
		'jquery/dist/jquery.min.js',
		'react/dist/react.min.js',
		'moment/min/moment.min.js',
		'underscore/underscore-min.js'
	]

	deps.forEach(function (dep) {
		var depPath = path.resolve(node_modules_dir, dep)
		configClone.resolve.alias[dep.split(path.sep)[0]] = depPath
		configClone.module.noParse.push(depPath)
	})

	webpack(configClone, function (err, stats) {
		if (err) {throw new gutil.PluginError('webpack', err)}
		var statsAsString = stats.toString({})

		gutil.log('[webpack]', statsAsString.split('chunk')[0])
		livereload.changed('public/js/main.js')
		callback()
	})
})

gulp.task('lint-frontend', function () {
	return gulp.src(['frontend/*.jsx', 'frontend/**/*.jsx', 'frontend/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
})

gulp.task('lint-backend', function () {
	return gulp.src(['gulpfile.js', 'server.js', 'runner.js', 'router/*.js', 'router/api/*.js', 'models/*.js', 'lib/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
})

gulp.task('lint', ['lint-backend', 'lint-frontend'])

gulp.task('watch', function () {
	livereload.listen()
	gulp.watch([
		'frontend/*.jsx',
		'frontend/widgets/*.jsx',
		'frontend/data/*.js'
	], ['webpack'])
	gulp.watch(['public/css/app.css'], ['reload'])
})
