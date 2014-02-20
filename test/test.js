var assert = require('assert'),
		should = require('should'),
		fs = require('fs'),
		path = require('path');
		mongoose = require('mongoose'),
		config = require('../config/config'),
		http = require('http'),
		mocks = require('./mocks.js'),
		mysql = require('mysql'),
		EventResource = require('../app/models/eventresource'),
		LanguageResource = require('../app/models/languageresource'),
		SignatureV1 = require('../app/signatures/signaturev1.js');

describe('Connection', function(){
	before(function(done) {
		mongoose.connect(config.db,done);
	});
	it('should include all models', function (done) {
		var modelsPath = path.dirname(__dirname) + '/app/models';
		fs.readdirSync(modelsPath).forEach(function (file) {
			if (file.indexOf('.js') >= 0) {
				require(modelsPath + '/' + file);
			}
		});

		done();
	});
	it('should log in as user', function (done) {
		//var user = require('../app/models/user');
		var user = mongoose.model('User');
		user.isValidUserPassword('marc@vancast.net', 'vancast', done)
	});
	it('should connect to mysql DB', function (done) {
		var connection = mysql.createConnection({
			host		: 'localhost',
			user		: 'marc',
			password: 'vancast'
		});
		connection.connect();
		var sql = 'SELECT event_id FROM ws_api_test.event WHERE acc_id = 1';
		connection.query(sql, function(err,results){
			for (var i = 0; i < results.length; i++) {
				var sql2 = 'SELECT * from ws_api_test.event_part WHERE event_id = ?';
				connection.query(sql2, results[0].event_id, function(err, results){
				});
			};
			done();
		});
	});
})

describe('generate signature test', function(){
	var date = 1391778505015,
		publicKey = 'UXwIHzOjcLfl2nWE',
		secret = '9700da79204fd3fd6b5ec3601ea823a20b5c6d38';
	var signature = 'c25de9a983aa8b3d6bd4138e3e884a003056c809';
	var signatureV1 = new SignatureV1();
	var generatedSign = signatureV1.generateSignature(publicKey, secret, date);
	it('should generate the signature: '+signature, function(){
		assert.equal('c25de9a983aa8b3d6bd4138e3e884a003056c809', generatedSign);
	})
})

describe('Signatre', function () {
	before(function(done){
		var modelsPath = path.dirname(__dirname) + '/app/models';
		fs.readdirSync(modelsPath).forEach(function (file) {
			if (file.indexOf('.js') >= 0) {
				require(modelsPath + '/' + file);
			}
		});
		done();
	});
	it('should do nothing', function (done) {
		var user = mongoose.model('User'),
				crypto = require('crypto'),
				signMiddleware = require('../config/middlewares/apiauth');
		var date = Date.now();
		var secret = '9700da79204fd3fd6b5ec3601ea823a20b5c6d38';
		var hmac = crypto.createHmac('sha1', secret);
		hmac.setEncoding('hex');
		hmac.write('UXwIHzOjcLfl2nWE'+date);
		hmac.end();
		var signature = hmac.read();
		//TODO: create a mockRequest object
		var request = {
			headers: {
				'date': date,
				'accesskey': 'UXwIHzOjcLfl2nWE',
				'signature': signature,
				'signatureVersion': 'v1'
			}
		};
		var res = new mocks.MockResponse();
		signMiddleware.checkRequest(request,res,done);
	});
});

describe('Resources tests', function () {
	var results = [];
	before(function(done){
		results.push({
			id: 789,
			name: 'Test event 1',
			description: 'Lorem ipsum dolor sit amet',
			start_date: Date.now(),
			finishing_date: Date.now(),
			status: 'live',
			lang_id: 28,
			lang_name: 'Català',
			lang_label: 'Audio en català'
		});
		done();
	});

	it('should be an EventResource instance', function () {
		var list = EventResource._parseListResult(results);
		var objs = [];
		for (var key in list){
			objs.push(list[key].toObject());
		}
		// console.log(list[0]);
		console.log(JSON.stringify(objs));
		// console.log(objs);
		list.should.be.instanceOf(Array);
		list[0].should.be.instanceOf(EventResource);
		list[0].should.have.property('languages');
		list[0].should.have.property('toObject');
		list[0].languages.should.be.instanceOf(Array);
		list[0].languages[0].should.be.instanceOf(LanguageResource);
	});
});