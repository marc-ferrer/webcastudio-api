var resources = require('../models/resource'),
	EventResource = require('../models/eventresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	//TODO: check req params
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	EventResource.list(req.clientApp.accId, function(err, eventsList){
		if (!err) {
			var objs = [];
			for (var key in eventsList){
				objs.push(eventsList[key].toObject());
			}
			res.json(200, objs);
		}else{
			res.send(404, 'Resource not found');
		}
	});
};

exports.get = function(req, res) {
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	EventResource.get(req.clientApp.accId, req.params.eventId, function(err, result){
		if (!err) {
			res.json(200, result.toObject());
		}else{
			res.send(404, 'Resource not found');
		}
	});
};