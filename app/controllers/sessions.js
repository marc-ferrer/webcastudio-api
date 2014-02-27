var SessionResource = require('../models/sessionresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	//TODO: check req params existance
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.list(req.params.eventId, function(err, sessionList){
		var objs = [];
		for (var key in sessionList){
			objs.push(sessionList[key].toObject());
		}
		res.json(200, objs);
	});
};

exports.get = function(req, res) {
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.get(req.params.sessionId, function(err, result){
		res.json(200, result.toObject());
	});
};