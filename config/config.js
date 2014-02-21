var path = require('path'),
		rootPath = path.normalize(__dirname + '/..'),
		env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		mySql: {
			console: {
				host : '127.0.0.1',
				port: 3306,
				user : 'marc',
				password: 'vancast',
				database: 'ws_api_test'
			}
		},
		mongo: {
			db: 'mongodb://admin:vancast@troup.mongohq.com:10060/ws-api'
		},
		root: rootPath,
		app: {
			name: 'webcastudio-api'
		},
		port: 3000
	},

	test: {
		mySql: {
			console: {
				host : 'localhost',
				user : 'marc',
				password: 'vancast',
				database: 'ws_api_test'
			}
		},
		mongo: {
			db: 'mongodb://admin:vancast@troup.mongohq.com:10060/ws-api'
		},
		root: rootPath,
		app: {
			name: 'webcastudio-api'
		},
		port: 3000
	},

	production: {
		mySql: {
			console: {
				host : process.env.DB_CONSOLE_HOST || 'localhost',
				user : process.env.DB_CONSOLE_USER || 'root',
				password: process.env.DB_CONSOLE_PASS || '',
				database: process.env.DB_CONSOLE_SCHEMA || 'ws_api_test'
			},
      pull: {
        host : process.env.DB_PULL_HOST || 'localhost',
        user : process.env.DB_PULL_USER || 'root',
        password: process.env.DB_PULL_PASS || '',
        database: process.env.DB_PULL_SCHEMA || 'ws_api_test'
      }
		},
		mongo: {
			db: 'mongodb://admin:vancast@troup.mongohq.com:10060/ws-api'
		},
		root: rootPath,
		app: {
			name: 'webcastudio-api'
		},
		port: 80
	}
};

module.exports = config[env];
