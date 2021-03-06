import koa from 'koa'
import session from 'koa-session-redis'
import render from 'koa-swig'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import flash from 'koa-flash'
import router from 'koa-router'
import db from './lib/db'
import logger from './lib/logger'
import env from './env'

var app = koa()

app.keys = ['some secret hurr']
app.use(session({
	store: {
		host: env.redis.host || '127.0.0.1',
		port: env.redis.port || 6379,
		ttl: 60 * 60 * 24 * 14
	}
}))

app.context.render = render({
	root: path.join(__dirname, 'views'),
	locals: {env: process.env.NODE_ENV},
	cache: false, // disable, set to false
	ext: 'html'
})

var serve = require('koa-static')
app.use( serve(__dirname + '/public') )

app.use(function *(next) {
	var start = new Date()
	yield next
	var ms = new Date() - start
	logger.info(this.response.status, this.request.method, 'Request to', this.request.url, 'took', ms + 'ms', this.response.length + 'b')
	this.set('X-Response-Time', ms + 'ms')
})

app.use(function *(next) {
	try {
		yield next
	} catch (err) {
		this.status = err.status || 500
		this.body = err.message
		this.app.emit('error', err, this)
	}
})

app.use(bodyParser())
app.use(flash())

app.use(require('./routers/base').routes())
	.use(require('./routers/login').routes())
	.use(require('./routers/app').routes())
	.use(require('./routers/api/base').routes())
	.use(router().allowedMethods())

var server = require('http').createServer(app.callback())

var io = require('socket.io')(server)
io.on('connection', function () {})
db.io = io

export default server
