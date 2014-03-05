var config = {
	scopes : {
		'ACCOUNT_READ': 1,
		'ACCOUNT_WRITE': 2,
		'EVENT_READ': 4,
		'EVENT_WRITE': 8,
		'SESSION_READ': 16,
		'SESSION_WRITE': 32,
		'STATS_READ': 64,
		'STATS_WRITE': 128,
		'ACCESS_READ': 256,
		'ACCESS_WRITE': 512,
		'APPS_READ': 1024,
		'APPS_WRITE': 2048
	},
	roles : {
		'APPS_MANAGER': ['APPS_READ', 'APPS_WRITE'],
		'STANDARD': ['EVENT_READ', 'SESSION_READ', 'STATS_READ', 'ACCESS_READ']
	}
};
module.exports.scopes = config.scopes;
module.exports.appRoles = buildAppScopes(config.scopes, config.roles);

function buildAppScopes(scopes, roles){
	var appRoles = {};
	for(var role in config.roles){
		var appRole = {
			title: role,
			bitMask: 0
		};
		//TODO: Faliure tolerance
		if(roles[role] === '*'){
			for(var key in scopes){
				appRole.bitMask+= scopes[role];
			}
		}else if(roles[role] instanceof String){
			appRole.bitMask = scopes[roles[role]];
		}else if(roles[role] instanceof Array){
			for(var index= 0; index < roles[role].length; index++){
				appRole.bitMask+= scopes[roles[role][index]];
			}
		} else {
			continue;
		}
		appRoles[role] = appRole;
	}
	return appRoles;
};