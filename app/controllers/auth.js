var passport = require('passport');

exports.login = function(req, res, next){
	passport.authenticate('local', { successRedirect: '/createapp',
								   failureRedirect: '/login',
								   failureFlash: false })(req, res, next);
};

module.exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
};