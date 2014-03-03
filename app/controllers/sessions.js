var SessionResource = require('../models/sessionresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	req.clientApp.updateRequestsInfo();
	var accesLevel = scopesConfig.scopes.SESSION_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.list(req.clientApp.accId, req.params.eventId, function(err, sessionList){
		if(!err){
			var objs = [];
			for (var key in sessionList){
				objs.push(sessionList[key].toObject());
			}
			res.json(200, objs);
		}else{
			res.send(404, 'Resource not found');
		}
	});
};

exports.get = function(req, res) {
	req.clientApp.updateRequestsInfo();
	var accesLevel = scopesConfig.scopes.SESSION_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	SessionResource.get(req.clientApp.accId, req.params.sessionId, function(err, result){
		if (!err) {
			res.json(200, result.toObject());
		}else{
			res.send(404, 'Resource not found');
		}
	});
};