import bunyan from 'bunyan';

var config = {
	name: 'main',
	streams:[
		{
			level: 'info',
			stream: process.stdout
		}	
	]
}

if(process.env.NODE_ENV){
	config.streams.push({
		level: 'info',
		path: '/var/tmp/myapp-error.log'
	});
}

var log = bunyan.createLogger(config);

log.info('Log started at', new Date);

export default log;