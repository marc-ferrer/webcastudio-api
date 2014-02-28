var util = require('util'),
	winston = require('winston'),
	Resource = require('./resource'),
	UserResource = require('./userresource'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql;

function StatsResource (config) {
	this.user = {}; //User Resource object.
	this.firstTime = config.datetime_in;
	this.lastUpdateTime = config.datetime_out;
	this.sessionId = config.part_id;
	this.eventId = config.event_id;
	this.languageId = config.point_id;
	this.type = config.type;
	this.acces = config.app_id;
	this.platform = config.platform;
	this.browser = config.browser;
}

util.inherits(StatsResource, Resource);

StatsResource.findUser = function(uid, handler){
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

StatsResource.list = function(accId, eventId, handler){
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
		}
	});
	var sql = 'SELECT acc_id as accId from event WHERE event_id = ?';
	connection.query(sql, eventId, function(err, result){
		//if permit
		var pullConnection = mysql.createConnection(mysqlConfig.pull);
		pullConnection.connect(function(err){
			if (err) {
				winston.error('DB connection error', err);
			}
		});
		var audienceSql = 'SELECT DISTINCT * FROM Audience_Log WHERE event_id = ?';
		pullConnection.query(audienceSql, eventId, function(err, result){
			var audienceList = [];
			var users = {};
			for (var i = 0; i < results.length; i++) {
				var stat = new StatsResource(results[i]);
				if (users[results[i].uid] === undefined) {
					UserResource.find(results[i].uid, function(err, user){
						stats.user = user;
					});
				}else{
					var user = users[results[i].uid];
					stat.user = user;
				}
			}
		});
	});
};

module.exports = StatsResource;