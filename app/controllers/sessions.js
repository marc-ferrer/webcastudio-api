var SessionResource = require('../models/sessionresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	//TODO: check req params existance
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.list(req.params.eventId, function(sessionList){
		var objs = [];
		for (var key in sessionList){
			// console.log(sessionList[key]);
			objs.push(sessionList[key].toObject());
		}
		// res.json(200, objs);
		res.json(200, sessionList);
	});
};

exports.get = function(req, res) {
	var accesLevel = scopesConfig.scopes.EVENT_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.get(req.params.sessionId, function(result){
		res.json(200, result.toObject());
	});
};