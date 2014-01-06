
var winston = require('winston');
var moment = require('moment');

module.exports = function(bot) {

  var config = bot.config;

  var customLevels = {

    levels: {
      info: 1,
      warn: 2,
      error: 3,
      debug: 4
    },

    colors: {
      debug: 'grey',
      info: 'green',
      warn: 'yellow',
      error: 'red'
    }

  };

  winston.addColors(customLevels.colors);

  bot.log = new (winston.Logger)({

    levels: customLevels.levels,

    transports: [
      new (winston.transports.Console)({ timestamp: function() { return moment().format("YYYY-MM-DD HH:mm:ss"); }, colorize: true }),
      new (winston.transports.File)({ filename: config.username + '.log' })
    ]

  });

  bot.validateTradeItems = function(arr1, arr2) {

    if (arr1.length !== arr2.length) {
      return false;
    }
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;

  };

};