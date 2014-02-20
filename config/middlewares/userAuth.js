var User = require('../../app/models/user');

exports.isAuthenticatedUser = function(req, res, next){
	if(req.isAuthenticated()){
		next();
	}else{
		//Alert depending on request
		res.redirect('/login');
	}
};