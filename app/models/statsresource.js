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

function getAudienceLogs(connection, users, eventId, handler){
	var sql = 'SELECT * FROM Audience_Log WHERE event_id = ?';
	connection.query(sql, eventId, function(err, results){
		if (results === undefined || results.length === 0) {
			winston.warn('Audience Logs not found');
			handler(true); //TODO: implement error codes
		}else{
			var audienceList = [];
			for (var i = 0; i < results.length; i++) {
				var stats = new StatsResource(results[i]);
				stats.user = users[results[i].uid];
				audienceList.push(stats);
			}
			handler(false, audienceList);
		}
	});
}

/**
 * List event stats
 * @param  {Number} accId   Account ID
 * @param  {Number} eventId Event ID
 * @param  {Function} handler handler function
 * @return {Array}    list of event statistics.
 */
StatsResource.list = function(accId, eventId, handler){
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
			handler(true); //TODO: error codes
		}
	});
	var sql = 'SELECT acc_id as accId from event WHERE event_id = ? AND acc_id = ?';
	connection.query(sql, [eventId, accId], function(err, result){
		if (result === undefined || result.length === 0) {
			winston.warn('Permission denyied');
			handler(true); //TODO: implement error codes //permission denyied.
		}else{
			var pullConnection = mysql.createConnection(mysqlConfig.pull);
			pullConnection.connect(function(err){
				if (err) {
					winston.error('DB connection error', err);
					handler(true); //TODO: implement error codes
				}
			});
			var audienceSql = 'SELECT DISTINCT uid FROM Audience_Log WHERE event_id = ?';
			pullConnection.query(audienceSql, eventId, function(err, results){
				if (results === undefined || results.length === 0) {
					winston.warn('Audience Logs not found');
					handler(true); //TODO: implement error codes
				}else{
					var users = {};
					var userCount = 0;
					for (var i = 0; i < results.length; i++) {
						UserResource.get(results[i].uid, function(err, user){
							userCount++;
							users[user.uid] = user;
							if (userCount === results.length) {
								getAudienceLogs(pullConnection, users, eventId, handler);
							}
						});
					}
				}
			});
		}
	});
};

module.exports = StatsResource;