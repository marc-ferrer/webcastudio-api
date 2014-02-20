var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	hash = require('../util/hash.js');

var UserSchema = new Schema({
	email	: String,
	hash	: String,
	salt	: String
});

UserSchema.statics.signUp = function(email, password, done){
	var User = this;
	hash(password, function(err, salt, hash){
	if(err){
		throw err;
	}
	User.create({
		email	: email,
		salt	: salt,
		hash	: hash
	}, function(err, user){
		if(err){
		throw err;
		}
		done(null, user);

	});
	});
};
UserSchema.statics.isValidUserPassword = function(email, password, done) {
	this.findOne({email : email}, function(err, user){
		// if(err) throw err;
		if(err) return done(err);
		if(!user) return done(null, false, { message : 'Incorrect email.' });
		hash(password, user.salt, function(err, hash){
			if(err) return done(err);
			if(hash == user.hash) return done(null, user);
			done(null, false, {
			message : 'Incorrect password'
			});
		});
	});
};

mongoose.model('User', UserSchema);