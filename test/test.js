var assert = require('assert'),
		should = require('should'),
		mocks = require('./mocks.js'),
		urlUtils = require('../app/util/urlutils'),
		EventResource = require('../app/models/eventresource'),
		LanguageResource = require('../app/models/languageresource'),
		SignatureV1 = require('../app/signatures/signaturev1.js');

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

describe('access url token generation', function () {
	var options = {
		protocol: 'https',
		domain: 'vancast.webcasting-studio.net'
	}
	var eventId = '788',
		appId = '5',
		sessionId = 985;
	it('should equal https://vancast.webcasting-studio.net/event/?e=788&a=5&t=YjljNDQzMDRiMmM4ZTY3MTliNmI2NDMyY2U3OTMzMzBlNDVlNjEwMg==&pt=985', function () {
		var url = urlUtils.setUrl(options, eventId, appId, sessionId);
		url.should.equal('https://vancast.webcasting-studio.net/event/?e=788&a=5&t=YjljNDQzMDRiMmM4ZTY3MTliNmI2NDMyY2U3OTMzMzBlNDVlNjEwMg==&pt=985');
	});
});