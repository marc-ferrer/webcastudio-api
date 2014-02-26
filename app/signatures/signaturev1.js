var crypto = require('crypto'),
	util = require('util'),
	abstractSignature = require('./abstractsignature');
//TODO: implement abstractSignature extend it.
function SignatureV1 () {
	this.algorithm = 'sha1';
	this.encoding = 'hex';
}
util.inherits(SignatureV1, abstractSignature);

/**
 * Generates the signature needed for API calls.
 * @param  {String} publicKey Client App public Key
 * @param  {String} secret    Client APp secret Key
 * @param  {String|number} date      date used to generate the signature, unix time stamp is suposed when number is used.
 * @return {String}           Signature
 */
SignatureV1.prototype.generateSignature = function(publicKey, secret, date) {
	var hmac = crypto.createHmac(this.algorithm, secret);
	hmac.setEncoding(this.encoding);
	hmac.write(publicKey+date);
	hmac.end();
	return hmac.read();
};

module.exports = SignatureV1;