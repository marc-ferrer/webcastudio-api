var crypto = require('crypto'),
	hash = require('../util/hash.js'),
	uid2 = require('uid2'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql;

function ClientApp (config) {
	this.appId = config.appId || config.app_id;
	this.appKey = config.appKey || config.app_key;
	this.secretKey = config.secretKey || config.secret_key;
	this.accId = config.accId || config.acc_id;
	this.role = config.role;
	this.createdAt = config.createdAt || config.created_at;
}

// AppSchema.statics.register = function(user, role){
// 	var ClientApp = this;
// 	//TODO: abstract generate secret process
// 	var uid = uid2(16);
// 	var date = new Date();
// 	var stringToHash = user.hash+user.email+date;
// 	hash = crypto.createHash('sha1').update(stringToHash + uid).digest('hex');
// 	console.log('clientApp Id: ', uid);
// 	console.log('clientApp Secret: ', hash);

// 	ClientApp.create({
// 		appId			: uid,
// 		appSecret	: hash,
// 		accId			: user.email,
// 		role			: role},
// 		function(err, user){
// 			if(err){
// 				throw err;
// 			}
// 		}
// 	);
// };

/**
 * generates a secret key.
 * @param  {String} psk optional parameter that can be used to encrypt the generated secret Key.
 * @return {String}     Secret Key generated.
 */
ClientApp._generateSecret = function(psk){
	psk = psk || uid2(16);
	var hmac = crypto.createHmac('sha1',  psk);
	hmac.setEncoding('hex');
	hmac.write(uid+date.now());
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
ClientApp.register = function(accId, role, psk){
	var uid = uid2(16);
	var date = new Date();
	var secret = ClientApp._generateSecret(psk);
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		if (err) {
			console.log(err);
		};
		// throw err;
	});
	var sql = 'INSERT INTO Client_App (app_id, app_key, secret_key, acc_id, role) VALUES (?)';
	var utcDate = date.toUTCString();
	var values = [uid, secret, accId, role, utcDate];
	connection.query(sql, values, function(err, result){
		if (err){
			//throw err;
			console.log('Error inserting client app into DB', err);
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
		console.log('error:',err);
		// throw err;
	});
	var sql = 'SELECT * FROM Client_App WHERE app_key = ?';
	connection.query(sql, appKey, function(err, results){
		console.log('results db select:',results);
		var clientApp = new ClientApp(results[0]);
		handler(clientApp);
	});
};

module.exports = ClientApp;