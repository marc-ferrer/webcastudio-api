var mongoose = require('mongoose'),
		ClientApp = mongoose.model('ClientApp'),
		SignatureV1 = require('../../app/signatures/signaturev1'),
		moment = require('moment');

exports.checkRequest = function (req, res, next) {
	console.log('checking request');
	var headers = req.headers;
	var date = headers['date'],
		publicKey = headers['publickey'],
		signature = headers['signature'];
	if ((date == undefined) || (publicKey == undefined) || (signature == undefined)){
		console.log('Incorrect headers');
		res.send(400,'Incorrect headers');
	}
	//checks if date is a number, so it is suposed to be a unix timestamp.
	if (!isNaN(date)){
		date = parseInt(date);
	}
	var nowMoment = moment(),
		pastMoment = moment(date);
	if (!pastMoment.isValid()){
		console.log('bad date format');
		res.send(400, 'bad date format');
	}
	if (nowMoment.diff(pastMoment, 'seconds') > 30){
		console.log('request expired');
		res.send(403, 'request expired');
	}
	switch(headers['signatureversion']){
		case 'v1':
			console.log()
			ClientApp.find(publicKey, function(app){
				var signatureV1 = new SignatureV1();
				var signToCheck = signatureV1.generateSignature(publicKey, app.appSecret, date);
				if(signToCheck !== signature){
					console.log('Bad signature');
					res.send(401, 'Bad signature');
				}else{
					req.clientApp = app;
					next();
				}
			});
			break;
	}
}
	