var winston = require('winston')
  , moment = require('moment')
  , config = require('./../config.json');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: function() { return moment().format("YYYY-MM-DD HH:mm:ss"); }, colorize: true }),
    new (winston.transports.File)({ filename: config.username + '.log' })
  ]
});