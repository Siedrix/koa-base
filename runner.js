require('babel/register')({
	sourceMap: 'inline',
	// include superfluous whitespace characters and line terminators
	compact: false
})

var server = require('./server.js')
var logger = require('./lib/logger')

server.listen(3000, function () {
	logger.info('Server running')
})
