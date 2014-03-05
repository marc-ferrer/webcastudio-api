var util = require('util'),
	crypto = require('crypto'),
	winston = require('winston'),
	Resource = require('./resource'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql;


function AccesResource (config) {
	this.id = config.app_id || config.appId;
	this.name = config.name;
	this.url = [];
}

util.inherits(AccesResource, Resource);

/**
 * generates access URL
 * @param {Object} url generation options, (protocol, domain, sessionId)
 * @param {Number} eventId Event Id
 * @param {Number} appId   application Id, (Id of the acces method)
 * @param {Number} langId  Language Id (event_point_id)
 */
function setUrl (options, eventId, appId, langId) {
	var url = '';
	url = options.protocol+'://'+options.domain+'/event/?e='+eventId+'&a='+appId;
	var additionalParams = '&pt='+langId;
	if (options.sessionId !== undefined) {
		additionalParams += '&p='+options.sessionId;
	}
	var key = 'q2ad5rD';
	var hmac = crypto.createHmac('sha1', key);
	hmac.setEncoding('base64');
	hmac.write(eventId+appId);
	hmac.end();
	var token = '&t=' + hmac.read();
	return url += additionalParams+token;
}

/**
 * List all access methods available for the given event. Provides the url for each acces & language.
 * if sessionId is provided in options the urls point to that specific session.
 * @param  {Number} accId   Account id
 * @param  {Number} eventId event id
 * @param  {Object} options (protocol, domain, sessionId)
 * @param  {Function} handler Handler function
 * @return {Array}         Returns an AccessResource list
 */
AccesResource.list = function(accId, eventId, options, handler){
	if (options instanceof Function) {
		handler = options;
	}
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error', err);
			handler(true);
		}
	});
	var sql = 'SELECT * FROM event WHERE acc_id = ? AND event_id = ?';
	connection.query(sql, [accId, eventId], function(err, result){
		if (result === undefined || result.length === 0) {
			winston.warn('permission denyied');
			handler(true); //permission denyied
		}else{
			var appSql = 'SELECT l.event_point_id, l.name as lName, l.description, l.event_id, a.app_id, a.name, a.description ';
			appSql += 'FROM event_point AS l LEFT JOIN Event_has_Application as ea INNER JOIN Application as a ON a.app_id = ea.app_id ON l.event_id = ea.event_id WHERE l.event_id = ?';
			connection.query(appSql, eventId, function(err, results){
				if (results === undefined || results.length === 0) {
					handler(true); //not found
				}else{
					var accesList = {};
					for (var i = 0; i < results.length; i++) {
						if (accesList[results[i].app_id] === undefined) {
							var access = new AccesResource(results[i]);
							var obj = {
								langId: results[i].event_point_id,
								name: results[i].lName,
								url: '' //generate URL
							};
							obj.url = setUrl(options, eventId, access.id, obj.langId);
							access.url.push(obj);
							accesList[results[i].app_id] = access;
						}else{
							var obj = {
								langId: results[i].event_point_id,
								name: results[i].lName,
								url: '' //generate URL
							};
							obj.url = setUrl(options, eventId, results[i].app_id, obj.langId);
							accesList[results[i].app_id].url.push(obj);
						}
					}
					handler(false,accesList);
				}
			});
		}
	});
};

module.exports = AccesResource;