var winston = require('winston')
  , config = require('./../config.json');

exports.log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true, colorize: true }),
    new (winston.transports.File)({ filename: config.username + '.log' })
  ]
});