
var fs = require('fs');

module.exports = function(sentry) {
  
  var bot = this;
  var config = bot.config;
  var sentryPath = __dirname + '/../../.' + config.username;

  // Save the sentry
  fs.writeFile(sentryPath, sentry, function(err) {

    if (err) {
      return console.error('Failed to save sentry: %s', err);
    }

    console.log('Sentry saved!');

  });

};