var util = require('util'),
	winston = require('winston'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql,
	Resource = require('../models/resource'),
	scopesConfig = require('../../config/scopesconfig');

function SessionResource (config) {
	this.id = config.id;
	this.name = config.name;
	this.appVersion = config.appVersion || 'not defined';
	this.templateId = config.templateId;
	this.starginDate = config.stargingDate;
	this.finishingDate = config.finishingDate;
	this.eventId = config.eventId;
	this.liveStatus = config.liveStatus || '';
	this.odStatus = config.odStatus || [];
}

util.inherits(SessionResource, Resource);

var getLiveInfo = function(session, handler){
	var connectionEventsDB = mysql.createConnection(mysqlConfig.events);
	connectionEventsDB.connect(function(err){
		if (err) {
			winston.error('connection to events DB error', err);
		}
	});
	var flagInfo = '* ';
	var sql2 = 'SELECT '+flagInfo+'FROM Webcast_Flags where part_id = ?';
	connectionEventsDB.query(sql2, session.id, function(err, results){
		if (results !== undefined && results.length > 0) {
			switch (results[0].live_publishing){
				case 0:
					session.liveStatus = 'off';
					break;
				case 1:
					if (results[0].live_open) {
						session.liveStatus = 'live_open';
					}else{
						session.liveStatus = 'live_publishing';
					}
			}
		}else{
			session.liveStatus = 'off';
		}
		handler(session);
	});
};

var getOdInfo = function(connection, session, handler){
	var odInfo = 'evP.event_point_id, evP.name, evP.channel_code, od.published ';
	var sql3 = 'SELECT '+odInfo+'FROM On_Demand as od JOIN event_point as evP USING(event_point_id) WHERE part_id = ?';
	connection.query(sql3, session.id, function(err, result){
		if (result !== undefined && result.length > 0) {
			for (var j = 0; j < result.length; j++) {
				var obj = {
					languageId: result[j].event_point_id,
					name: result[j].name,
				};
				if (result[j].published) {
					obj.status = 'published';
				}else{
					obj.status = 'pending';
				}
				session.odStatus.push(obj);
			}
			handler(session);
		}
	});
};

SessionResource.list = function(accId, eventId, handler){
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
		}
	});
	var sessionList = [];
	var counter = 0;
	// var sessionInfo = 'part_id as id, name as name, kernel_version as appVersion, theme_id as templateId, starting_date as startingDate, finishing_date as finishingDate, event_id as eventId ';
	var sessionInfo = 'ep.part_id as id, ep.name as name, ep.kernel_version as appVersion, ep.theme_id as templateId, ep.starting_date as startingDate, ep.finishing_date as finishingDate, ep.event_id as eventId ';
	var sql = 'SELECT '+sessionInfo+'FROM event_part as ep JOIN event as e USING(event_id) WHERE event_id = ? AND acc_id = ?';
	connection.query(sql, [eventId, accId], function(err, results){
		//TODO: Check live & OD status.
		if (results === undefined || results.length === 0) {
			handler(true);
		}else{
			for (var i = 0; i < results.length; i++) {
				//events DB connection.
				var session = new SessionResource(results[i]);
				sessionList.push(session);
				getLiveInfo(session, function(session){
					getOdInfo(connection, session, function(session){
						counter++;
						if (counter === results.length) {
							handler(false, sessionList);
						}
					});
				});
			}
		}
	});
};

SessionResource.get = function(accId, sessionId, handler){
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
		}
	});
	var sessionInfo = 'ep.part_id as id, ep.name as name, ep.kernel_version as appVersion, ep.theme_id as templateId, ep.starting_date as startingDate, ep.finishing_date as finishingDate, ep.event_id as eventId ';
	var sql = 'SELECT '+sessionInfo+'FROM event_part as ep JOIN event as e USING(event_id) where part_id = ? AND acc_id = ?';
	connection.query(sql, [sessionId, accId], function(err, results){
		if (results === undefined || results.length === 0) {
			handler(true);
		}else{
			var session = new SessionResource(results[0]);
			getLiveInfo(session, function(session){
				getOdInfo(connection, session, function(session){
					handler(false, session);
				});
			});
		}
	});

};

module.exports = SessionResource;

//liveStatus -> events DB .Webcast_Flags
/*Si no existeix registre -> off (Mai ha esat en directe)
	Si existeix & live_status == 0 -> off
	si existeix & live_status == 1 & live_open = 0 -> live_publishing
	si existeix & live_status == 1 & live_open = 1 -> live_open
 */

//on demand status -> console DB .On_Demand
/*Si no existeix registre -> []
	Si existeix -> enviar una array amb informació per cada event_point
 */