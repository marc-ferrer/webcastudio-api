var express = require('express'),
  fs = require('fs'),
  config = require('./config/config'),
  winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: 'true'})
winston.log('info', 'winston logger initiated');
// winston.add(winston.transports.File, {timestamp: 'true', filename: './autopresentation.log'});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(config.port);
