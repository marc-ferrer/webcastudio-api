var ClientApp = require('../../app/models/clientApp'),
		SignatureV1 = require('../../app/signatures/signaturev1'),
		moment = require('moment'),
		winston = require('winston');

/**
 * Checks request headers and signature
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 */
exports.checkRequest = function (req, res, next) {
	var headers = req.headers;
	var date = headers['date'],
		publicKey = headers['publickey'],
		signature = headers['signature'];
	if ((date == undefined) || (publicKey == undefined) || (signature == undefined)){
		winston.warn('Incorrect headers');
		res.send(400,'Incorrect headers');
	}
	//checks if date is a number, so it is suposed to be a unix timestamp.
	if (!isNaN(date)){
		date = parseInt(date);
	}
	var nowMoment = moment(),
		pastMoment = moment(date);
	if (!pastMoment.isValid()){
		winston.warn('bad date format');
		res.send(400, 'bad date format');
	}
	if (nowMoment.diff(pastMoment, 'seconds') > 30){
		winston.warn('request expired');
		res.send(403, 'request expired');
	}
	switch(headers['signatureversion']){
		case 'v1':
			ClientApp.find(publicKey, function(app){
				var now = Date.now();
				if (now - app.lastRequest > app.period*60*1000) {
					app.requestCount = 0;
				};
				app.lastRequest = now;
				if (app.requestCount >= app.requestsLimit) {
					winston.warn('request per period exceeded for app:', app.appId);
					res.send(401,'Request limit exceeded');
				}
				app.requestCount++;
				var signatureV1 = new SignatureV1();
				var signToCheck = signatureV1.generateSignature(publicKey, app.secretKey, date);
				if(signToCheck !== signature){
					winston.warn('Bad signature');
					res.send(401, 'Bad signature');
				}else{
					req.clientApp = app;
					next();
				}
			});
			break;
	}
}
	