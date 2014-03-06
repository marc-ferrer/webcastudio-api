var ClientApp = require('../models/clientApp'),
	scopesConfig = require('../../config/scopesconfig');

exports.create = function (req, res) {
	var accesLevel = scopesConfig.scopes.APPS_WRITE;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	ClientApp.register(req.body.name, req.params.accId, req.body.role, req.body.psk, function(err, clientApp){
		if (err) {
			console.log(err);
			res.send(500);
		}else{
			res.send(200, 'app registered');
		}
	});
	console.log('apps create');
};

exports.get = function(req, res){
	var accesLevel = scopesConfig.scopes.APPS_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	ClientApp.find(req.params.appKey, function(err, clientApp){
		if (err) {
			res.send(500); //500?
		}else{
			res.json(200, clientApp);
		}
	});
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
			res.json(200, list);
		}
	});
};

exports.listRoles = function(req, res){
	console.log('listRoles');
	var accesLevel = scopesConfig.scopes.APPS_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	res.json(200, scopesConfig.roles);
};