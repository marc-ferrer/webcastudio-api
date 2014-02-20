module.exports = function(app, passport){

	var home = require('../app/controllers/home'),
			login = require('../app/controllers/login.js'),
			createapp = require('../app/controllers/createapp'),
			auth = require('../app/controllers/auth.js'),
			userAuth = require('./middlewares/userAuth'),
			apiAuth = require('./middlewares/apiauth'),
			eventsController = require('../app/controllers/events');

	// home route
	app.get('/login', login.login);
	app.post('/login', auth.login);
	app.get('/createapp', userAuth.isAuthenticatedUser, createapp.createApp);
	app.post('/createapp', userAuth.isAuthenticatedUser, createapp.registerApp);


	//TODO: Apps manager API
	/*app.post('/apps/new', apiAuth.checkRequest, controller);
	app.get('/apps/list', apiAuth.checkRequest, controller);
	app.get('/apps/roles/list', apiAuth.checkRequest, controller);
	app.post('/apps/:appId', apiAuth.checkRequest, controller);*/


	/**
	 * @api {get} /events/list list
	 * @apiName webcasting-studio-api.
	 * @apiGroup Events
	 *
	 * @apiSuccess {String} result returns al events of your account.
	 */
	app.get('/events/list', apiAuth.checkRequest, eventsController.list);

	/**
	 * @api {get} /events/:eventid get
	 * @apiName get
	 * @apiGroup Events
	 * @apiParam {Number} event_id Event unic ID.
	 * @apiSuccess {event_resource} result returns an event resource.
	 *
	 */
	app.get('/events/:eventId', apiAuth.checkRequest, eventsController.get);

	/**
	 * @api {get} /events/:eventid/stats get
	 * @apiName asdasgf
	 * @apiGroup Stats
	 *
	 * @apiParam {Number} event_id Event unic ID.
	 *
	 * @apiSuccess {stats_resource} result returns event statistics.
	 *
	 */
	app.get('/events/:eventId/stats', apiAuth.checkRequest, function(){});
	app.get('/events/:eventId/sessions/list', apiAuth.checkRequest, function(){});
	app.get('/events/:eventId/sessions/:sessionId', apiAuth.checkRequest, function(){});
	//definir parametres opcionals a la ruta de stats
	//els parametres serien: session, point(idioma) i live | OD
	//també es pot definir un parametre opcionals per ordenar els resultats
	//s'ha de poder ordenar per qualsevol paràmetre
	//
	//
	//poder filtrar les consultes de event program per idioma
	//----------------------------------------------//
	// app.get('/getapp', apptest.findApp);
	app.get('/*',home.index);

	// //Sample
	// app.get('event', apiAuth.checkRequest, function(req, res, next){
	// 	//Check access level
	// 	req.client.sope;
	// });
};