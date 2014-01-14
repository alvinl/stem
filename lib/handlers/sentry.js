
var fs = require('fs');
var scriptPath = require('path').dirname(require.main.filename);

module.exports = function(sentry) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var sentryPath = scriptPath + '/.' + config.username;

  // Save the sentry
  fs.writeFile(sentryPath, sentry, function(err) {

    if (err) {
      return log.error('Failed to save sentry:', err);
    }

    log.info('Sentry saved!');

  });

};