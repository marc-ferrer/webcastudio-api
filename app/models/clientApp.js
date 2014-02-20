var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	hash = require('../util/hash.js'),
	uid2 = require('uid2');

var AppSchema = new Schema({
	appId			: String,
	appSecret	: String,
	accId			: String,
	role			: String,
	createdAt	: { type: Date, default: Date.now }
});

AppSchema.statics.register = function(user, role){
	var ClientApp = this;
	//TODO: abstract generate secret process
	var uid = uid2(16);
	var date = new Date();
	var stringToHash = user.hash+user.email+date;
	hash = crypto.createHash('sha1').update(stringToHash + uid).digest('hex');
	console.log('clientApp Id: ', uid);
	console.log('clientApp Secret: ', hash);

	ClientApp.create({
		appId			: uid,
		appSecret	: hash,
		accId			: user.email,
		role			: role},
		function(err, user){
			if(err){
				throw err;
			}
		}
	);
};

AppSchema.statics.find = function(appKey, handler){
	this.findOne({appId: appKey}, function(err, app){
		if(err) throw err;
		if(!app) throw new Error('app not found');
		handler(app);
	});};

mongoose.model('ClientApp', AppSchema);