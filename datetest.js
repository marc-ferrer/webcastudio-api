var moment = require('moment');
var date = new Date;
var str = date.toUTCString()
var unixstr = Date.now();
console.log(str);
var incomingDate = moment(str);
// console.log(moment().format(str));
// console.log(moment.parseZone(str).zone());
// var testH = moment().zone(2);
// var unix = moment().format('X');
// var testHstr = testH.format();
// console.log(testHstr);
// var ntest = testH.zone(0);

console.log('--------------------------');
// var newmoment = moment().utc(str);
// console.log(newmoment.format());
// console.log(newmoment.zone(0).format());
var str = '';
str+= unixstr;
console.log(parseInt(str));
console.log(isNaN(str));
var unixmoment = moment(unixstr);
if (unixmoment.isValid()){
	console.log('valid');
}else{
	console.log('invalid');
}
// var unixmoment = moment().utc();
// unixmoment.zone(3);
// console.log(unixstr);
// console.log(unixmoment.format());
// console.log(newmoment.format());
// console.log(unixmoment.diff(newmoment, 'hours'));
// console.log('--------------------------');

// console.log('unix zone:');
// console.log(moment().format('X'));
// console.log(moment().zone());
// console.log(moment().utc(Date.now).format());
// console.log(moment().utc(str).format('X'));
// console.log('now', moment().unix());
