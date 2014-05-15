
module.exports = function(sentry) {

  var log        = this.log,
      config     = this.config,
      fs         = require('fs'),
      sentryPath = this.path + '/.' + config.username;

  // Save the sentry
  fs.writeFile(sentryPath, sentry, function(err) {

    // Error saving sentry
    if (err) return log.error('Failed to save sentry:', err.stack);

    log.info('Sentry saved!');

  });

};