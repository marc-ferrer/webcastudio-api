var resources = require('../models/resource'),
	AccesResource = require('../models/accesresource'),
	scopesConfig = require('../../config/scopesconfig');

exports.list = function (req, res) {
	req.clientApp.updateRequestsInfo();
	var accesLevel = scopesConfig.scopes.ACCESS_READ;
	if ((scopesConfig.appRoles[req.clientApp.role].bitMask & accesLevel) !== accesLevel){
		res.send(403, 'This appKey doesn\'t have permission to acces to this information');
	}
	var options = {
		domain: req.query.domain || req.clientApp.domain,
		protocol: req.query.protocol || 'https'
	};
	if (req.query.sessionId) {
		options.sessionId = req.query.sessionId;
	}
	AccesResource.list(req.clientApp.accId, req.params.eventId, options, function(err, accessList){
		if (!err) {
			var objs = [];
			for (var key in accessList){
				objs.push(accessList[key].toObject());
			}
			res.json(200, objs);
		}else{
			res.send(404, 'Resource not found');
		}
	});
};