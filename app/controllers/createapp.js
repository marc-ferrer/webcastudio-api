var clientApp = require('../models/clientApp'),
		mongoose = require('mongoose');

exports.createApp = function(req, res){
	res.render('createapp', {title: 'register your new App'});
};

exports.registerApp = function(req, res){
	var App = mongoose.model('ClientApp');
	App.register(req.user, req.body.role);
	res.send(200, 'App registered');
};