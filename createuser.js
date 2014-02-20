var argv = require('optimist').argv,
	readline = require('readline'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	config = require('./config/config');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function ask(question,handler){
	rl.question(question, function(answer){
		handler(answer);
	});
}
function get(arg, handler){
	var key = arg.toLowerCase();
	if(argv[key] !== undefined){
		handler(null,argv[key]);
	}else {
		ask(arg+':', function(answer){
			handler(null, answer);
		});
	}
}
//Get Email
get('Email', function(err, email){
	if(err){
		throw err;
	}
	//Get Password
	get('Password', function(err, password){
		if(err){
			throw err;
		}
		rl.close();
		//Connect to mongodb
		mongoose.connect(config.mongo.db);
		var db = mongoose.connection;
		db.on('error', function () {
			throw new Error('unable to connect to database at ' + config.db);
		});

		var modelsPath = __dirname + '/app/models';
		fs.readdirSync(modelsPath).forEach(function (file) {
			if (file.indexOf('.js') >= 0) {
				require(modelsPath + '/' + file);
			}
		});
		var User = mongoose.model('User');
		User.signUp(email, password, function(err, user){
			if(err){
				throw err;
			}
			console.log('New user created', user);
			process.exit();
		});
	});
});