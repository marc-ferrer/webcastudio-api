var util = require('util'),
	winston = require('winston'),
	Resource = require('./resource'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql;

function UserResource (config) {
	this.uid = config.uid;
	this.email = config.email;
	this.firstname = config.firstname;
	this.secondname = config.secondname;
	this.organization = config.organization;
}

util.inherits(UserResource, Resource);

UserResource.get = function(uid, handler){
	var eventsConnection = mysql.createConnection(mysqlConfig.events);
	eventsConnection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
		}
	});
	var userSql = 'SELECT email, firstname, secondname, organization FROM User WHERE uid = ?';
	eventsConnection.query(userSql, uid, function(err, result){
		if (result === undefined || result.length === 0) {
			handler(true);
		}else{
			var user = new UserResource(result[0]);
			handler(false,user);
		}
	});
};

module.exports = UserResource;