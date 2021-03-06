var crypto = require('crypto'),
	util = require('util'),
	Resource = require('../models/resource'),
	winston = require('winston'),
	uid2 = require('uid2'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql;

function ClientApp (config) {
	this.name = config.name;
	this.appId = config.appId || config.app_id;
	this.appKey = config.appKey || config.app_key;
	this.secretKey = config.secretKey || config.secret_key;
	this.accId = config.accId || config.acc_id;
	this.role = config.role;
	this.createdAt = config.createdAt || config.created_at;
	this.requestCount = config.requestCount || config.request_count;
	this.requestLimit = config.requestsLimit || config.requests_limit;
	this.lastRequest = config.lastRequest || config.last_request;
	this.domain = config.domain;
}

util.inherits(ClientApp, Resource);

/**
 * Updates request control information.
 * 
 */
ClientApp.prototype.updateRequestsInfo = function() {
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB Connection error',err);
		}
	});
	var sql = 'UPDATE Client_App SET request_count = ?, last_request = ? WHERE app_id = ?';
	connection.query(sql, [this.requestCount, this.lastRequest, this.appId], function(err, result){
		if (err) {
			winston.warn('Error updating ClientApp requests info', err);
		}
	});
};

/**
 * generates a secret key.
 * @param  {String} psk optional parameter that can be used to encrypt the generated secret Key.
 * @return {String}     Secret Key generated.
 */
ClientApp._generateSecret = function(uid, psk){
	psk = psk || uid2(16);
	var hmac = crypto.createHmac('sha1',  psk);
	hmac.setEncoding('hex');
	hmac.write(uid+Date.now());
	hmac.end();
	return hmac.read();
};

/**
 * registers a new App in the DB.
 * @param  {Number} accId Id of the account registering the App.
 * @param  {String} role  Client App role defined at scopesconfig.js.
 * @param  {Strign} psk   optional parameter that can be used to encrypt the generated Key.
 * @return {ClientApp}    Client App registered.
 */
ClientApp.register = function(name, accId, role, psk, handler){
	var uid = uid2(16);
	var date = new Date();
	var secret = ClientApp._generateSecret(uid ,psk);
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error',err);
		}
	});
	var sql = 'INSERT INTO Client_App (name, app_key, secret_key, acc_id, role, created_at) VALUES (?,?,?,?,?,?)';
	var utcDate = date.toUTCString();
	var values = [name, uid, secret, accId, role, utcDate];
	connection.query(sql, values, function(err, result){
		if (err){
			//throw err;
			winston.warn('Error inserting client app into DB', err);
		}else{
			winston.info(result);
			handler(false, '');
		}
	});
	//TODO: returns new ClientApp object.
};

/**
 * finds a Client App in the DB
 * @param  {String} appKey  appKey of the Client App you want to find
 * @param  {Function} handler handler function
 * @return {ClientApp}         returns a ClientApp object.
 */

//TODO: find out wether it's necessary to close mysql connection or not.
ClientApp.find = function(appKey, handler) {
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error',err);
			handler(true);
		}
	});
	var sql = 'SELECT * FROM Client_App WHERE app_key = ?';
	connection.query(sql, appKey, function(err, results){
		if (results === undefined || results.length === 0) {
			handler(true);
		}else{
			var clientApp = new ClientApp(results[0]);
			handler(false, clientApp);
		}
	});
};

ClientApp.list = function(accId, handler){
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			winston.error('DB connection error',err);
			handler(true);
		}
	});
	var sql = 'SELECT * FROM Client_App WHERE acc_id = ?';
	connection.query(sql, accId, function(err, results){
		if (results === undefined || results.length === 0) {
			winston.warn('no client apps available for this account.');
			handler(true);
		}else{
			var list = [];
			for (var i = 0; i < results.length; i++) {
				var clientApp = new ClientApp(results[i]);
				list.push(clientApp);
			}
			handler(false, list);
		}
	});
};

module.exports = ClientApp;