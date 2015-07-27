// allow es6
require('babel/register')({
	sourceMap: 'inline',
	// include superfluous whitespace characters and line terminators
	compact: false
});

var koa = require('koa');
var session = require('koa-session-redis');
var render = require('koa-swig');
var path = require('path');
var serve = require('koa-static');
var bodyParser = require('koa-bodyparser');
var flash = require ('koa-flash');
var router = require('koa-router')();
var db = require('./lib/db');

var app = koa();

app.keys = ['some secret hurr'];
app.use(session({
	store: {
		host: process.env.REDIS_ADDR || '127.0.0.1',
		port: process.env.REDIS_PORT || 6379,
		ttl: 60 * 60 * 24 * 14,
	},
}));

app.context.render = render({
	root: path.join(__dirname, 'views'),
	cache: false, // disable, set to false
	ext: 'html'
});

app.use(serve(__dirname + '/public'));
app.use(function *(next){
	var start = new Date();
	yield next;
	var ms = new Date() - start;
	console.log(this.response.status, this.request.method, 'Request to', this.request.url, 'took', ms +'ms', this.response.length + 'b');
	this.set('X-Response-Time', ms + 'ms');
});

app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit('error', err, this);
	}
});

app.use(bodyParser());
app.use(flash());


app
	.use(require('./routers/base').routes())
	.use(require('./routers/login').routes())
	.use(require('./routers/app').routes())
	.use(require('./routers/api/base').routes())
	.use(router.allowedMethods());

var server = require('http').createServer(app.callback());

var io = require('socket.io')(server);
io.on('connection', function(){ console.log('new socket connection') });
db.io = io;

server.listen(3000, ()=> console.log('Server running') );
