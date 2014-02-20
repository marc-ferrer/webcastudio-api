

function MockRequest () {
	this.headers = {};
	this.params = {};
	this.query = {};
}

MockRequest.prototype.setHeaders = function(headers) {
	this.headers = headers;
};

MockRequest.prototype.setParams = function(params) {
	this.params = params;
};

MockRequest.prototype.setQuery = function(query) {
	this.query = query;
};

function MockResponse () {
	
	this.send = function(code, message){
		var msg = message || '';
		console.log(code + ' ' + msg);
	}
}

module.exports.MockRequest = MockRequest;
module.exports.MockResponse = MockResponse;
