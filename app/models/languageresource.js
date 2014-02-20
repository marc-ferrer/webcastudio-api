var util = require('util'),
	Resource = require('./resource');
	// mysql = require('mysql');

function LanguageResource (config) {
	this.id = config.id;
	this.name = config.name;
	this.label = config.label;
}

util.inherits(LanguageResource, Resource);

LanguageResource.prototype.toObject = function() {
	var obj = {
		id		: this.id,
		name	: this.name,
		label	: this.label
	};
	return obj;
};

module.exports = LanguageResource;