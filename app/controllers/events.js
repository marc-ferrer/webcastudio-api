var resources = require('../models/resource'),
	EventResource = require('../models/eventresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	//TODO: check req params
	var accesLevel = scopesConfig.scopes['EVENT_READ'];
	if ((scopesConfig.appRoles[req.clientApp.role] & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	EventResource.list(req.clientApp.accId, function(eventsList){
		var objs = [];
		for (var key in eventResults){
			objs.push(eventResults[key].toObject());
		}
		res.json(200, objs);
	});
}

exports.get = function(req, res) {
	var accesLevel = scopesConfig.scopes['EVENT_READ'];
	// if ((scopesConfig.appRoles[req.clientApp.role] & accesLevel) !== accesLevel){
	// 	res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	// }
	EventResource.get(req.params.eventId, function(result){
		console.log(JSON.stringify(result.toObject()));
		res.json(200, result.toObject());
	});
}