var StatsResource = require('../models/statsresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function(req, res){
	req.clientApp.updateRequestsInfo();
	var accesLevel = scopesConfig.scopes.STATS_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	StatsResource.list(req.clientApp.accId, req.params.eventId, function(err, statsList){
		if (!err) {
			var objs = [];
			for (var key in statsList){
				objs.push(statsList[key].toObject());
			}
			res.json(200, objs);
		}else{
			res.send(404, 'Resource not found');
		}
	});
};