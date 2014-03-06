var ClientApp = require('../models/clientApp'),
	scopesConfig = require('../../config/scopesconfig');

exports.create = function (req, res) {
	var accesLevel = scopesConfig.scopes.APPS_WRITE;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	ClientApp.register('test2', req.params.accId, req.params.role, req.query.psk, function(err, clientApp){
		if (err) {
			console.log(err);
			res.send(500);
		}else{
			res.send(200, 'app registered');
		}
	});
	console.log('apps create');
};

exports.postCreate = function (req, res) {
	var accesLevel = scopesConfig.scopes.APPS_WRITE;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	console.log('request query', req.query);
	console.log('request params', req.params);
	console.log('request body', req.body);
	ClientApp.register('test2', req.params.accId, req.params.role, req.query.psk, function(err, clientApp){
		if (err) {
			console.log(err);
			res.send(500);
		}else{
			res.send(200, 'app registered');
		}
	});
	console.log('apps create');
};

exports.list = function(req, res){
	var accesLevel = scopesConfig.scopes.APPS_WRITE;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	ClientApp.list(req.params.accId, function(err, list){
		if (err) {
			res.send(500); //500?
		}else{
			res.send(200, list);
		}
	});
};

exports.listRoles = function(req, res){
	console.log('listRoles');
	var accesLevel = scopesConfig.scopes.APPS_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	res.send(200, scopesConfig.roles);
};