var crypto = require('crypto');

/**
 * generates access URL
 * @param {Object} url generation options, (protocol, domain, sessionId)
 * @param {Number} eventId Event Id
 * @param {Number} appId   application Id, (Id of the acces method)
 * @param {Number} langId  Language Id (event_point_id)
 */
exports.setUrl = function (options, eventId, appId, langId) {
	var url = '';
	url = options.protocol+'://'+options.domain+'/event/?e='+eventId+'&a='+appId;
	var additionalParams = '&pt='+langId;
	if (options.sessionId !== undefined) {
		additionalParams += '&p='+options.sessionId;
	}
	var key = 'q2ad5rD';
	var hmac = crypto.createHmac('sha1', key);
	hmac.setEncoding('hex');
	hmac.write(eventId+appId);
	hmac.end();
	var token_hex = hmac.read().toString();
	var token64_buff = new Buffer(token_hex);
	var token = '&t=' + token64_buff.toString('base64');
	return url += token+additionalParams;
};