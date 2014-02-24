var ClientApp = require('../models/clientApp');

exports.createApp = function(req, res){
	res.render('createapp', {title: 'register your new App'});
};

exports.registerApp = function(req, res){
	//TODO: change when implemented ClientApp.register()
	//
	// ClientApp.register(req.user, req.body.role);
	res.send(200, 'App registered');
};