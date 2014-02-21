var util = require('util'),
	Resource = require('./resource'),
	mysql = require('mysql'),
	mysqlConfig = require('../../config/config').mySql,
	LanguageResource = require('./languageresource');

function EventResource (config) {
	this.id = config.id;
	this.name = config.name || config.long_name;
	this.description = config.description
	this.starting_date = config.starting_date;
	this.finishing_date = config.finishing_date;
	this.status	= config.status;
	this.languages = [];
}

util.inherits(EventResource, Resource);

/**
 * adds a language resource to this event resource
 * @param {LanguageResource|Object} lang
 * @this { EventResource}
 */
EventResource.prototype.addLanguage = function(lang){
	if(lang instanceof LanguageResource){
		this.languages.push(lang);
	}else {
		this.languages.push(new LanguageResource(lang));
	}
};

EventResource.get = function(event_id, handler) {
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		console.log('DB connection error', mysqlConfig.console);
		console.log(err);
		// throw err;
	});
	var eventInfo = 'e.event_id as id, e.long_name as name, e.description, e.starting_date, e.finishing_date, e.status, ';
	var langInfo = 'l.event_point_id as lang_id, l.name as lang_name, l.description as lang_label ';
	var sql = 'SELECT '+eventInfo+langInfo+'FROM event as e JOIN ws_api_test.event_point as l USING(event_id) WHERE event_id = ?';
	connection.query(sql, event_id, function(err, result){
		var eventResult = EventResource._parseListResult(result);
		handler(eventResult[0]);
	});
};

EventResource.list = function(accId, handler) {
	var connection = mysql.createConnection(mysqlConfig.console);
	connection.connect(function(err){
		console.log('DB connection error');
		// throw err;
	});
	var eventInfo = 'e.event_id as id, e.long_name as name, e.description, e.starting_date, e.finishing_date, e.status, ';
	var langInfo = 'l.event_point_id as lang_id, l.name as lang_name, l.description as lang_label ';
	var sql = 'SELECT '+eventInfo+langinfo+'FROM event as e JOIN ws_api_test.event_point as l USING(event_id) WHERE acc_id = ?';
	connection.query(sql, accId, function(err, results){
		console.log(results);
		//create new event resource list with results.
		var eventResults = EventResource._parseListResult(results);
		//TODO: implement resourceCollection class with toObject method
		handler(eventResults);
	});
};

/**
 * Given a query result array of events, returns an array of event resources.
 * @param  {Array} Results query result array.
 * @return {Array} Array of events resources.
 */
EventResource._parseListResult = function(results){
	var eventResults = [];
	var events = {};
	for (var key in results){
		var row = results[key];
		if(events[row.id] !== undefined){
			//Event already processed	
			var eventResource = eventResults[events[row.id]];
			eventResource.addLanguage({
				id: row.lang_id,
				name: row.lang_name,
				label: row.lang_label
			});
		}else {
			//New event for processing
			var eventResource = new EventResource(row);
			eventResource.addLanguage({
				id: row.lang_id,
				name: row.lang_name,
				label: row.lang_label
			});
			events[eventResource.id] = eventResults.length;
			eventResults.push(eventResource);
		}	
	}
	return eventResults;
};

module.exports = EventResource;