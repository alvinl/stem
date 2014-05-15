
/**
 * Dependencies
 */

var winston = require('winston'),
    moment  = require('moment'),
    path    = require('path'),
    fs      = require('fs');

/**
 * Creates and returns a logging instance
 * @param  {Object} config
 * @return {Object}    
 */

module.exports = function (config) {

  // Check if log directory exists
  var logDirectoryExists = fs.existsSync(path.dirname(require.main.filename) + '/logs');

  // Create log directory if it doesn't exist
  if (!logDirectoryExists) fs.mkdirSync(path.dirname(require.main.filename) + '/logs');

  var username = (config.username || 'error');

  var logLevels = {

    levels: {

      info:  1,
      warn:  2,
      error: 3,
      debug: 4

    },

    colors: {

      debug: 'grey',
      info:  'green',
      warn:  'yellow',
      error: 'red'

    }

  };

  winston.addColors(logLevels.colors);

  return new (winston.Logger)({

    levels: logLevels.levels,

    transports: [
      new (winston.transports.Console)({ timestamp: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); } , colorize: true }),
      new (winston.transports.File)({ filename: 'logs/' + username + '.log' })
    ]

  });

};
