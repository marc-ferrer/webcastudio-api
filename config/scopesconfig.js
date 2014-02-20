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
		'APPS_READ': 256,
		'APPS_WRITE': 512
	},
	roles : {
		'APPS_MANAGER': ['APPS_READ', 'APPS_WRITE'],
		'STANDARD': ['EVENT_READ', 'SESSION_READ', 'STATS_READ']
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
				appRole.bitMask+= socpes[role];
			}
		}else if(roles[role] instanceof String){
			appRole.bitMask = scopes[roles[role]];
		}else if(roles[role] instanceof Array){
			for(var index= 0; index < roles[role].length; index++){
				appRole.bitMask+= roles[role][index];
			}
		} else {
			continue;
		}
		appRoles[role] = appRole;
	}
	return appRoles;
};


//accesLevel = scopes.ACCOUNT_READ + scopes.EVENT_WRITE etc.
	//clientApp.access = scopes.X + scopes.Y + scopes.Z
	//auth = client.acces & accesLevel
	//grant if auth === accesLevel

//module.exports.roles = roles;



//Program 

/*var scopes = require('rolesConfig').scopes
, appRoles = require('rolesConfig').appRoles;

var clientApp = {
	accId = 6,
	appKey = 'jjjjjj',
	appSecret = 'lllklkkl',
	role = 'ADMIN'
};

var routeLevel = socpes.EVENTS_READ;
var clientAccess = appRoles[clientApp.role].bitMask;
var access = routeLevel & clientAccess;
if(access !== routeLevel){
	return res.send(401);
}*/