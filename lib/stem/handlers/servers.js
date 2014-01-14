
var fs = require('fs');

module.exports = function(serverlist) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var debugEnabled = config.debug;
  var serversPath = __dirname + '/../../../.servers';

  // Log that we're saving the server list if debug is on
  if (debugEnabled) {
    log.debug('Saving server list');
  }

  // Save the server list
  fs.writeFile(serversPath, JSON.stringify(serverlist), function (err) {

    if (err) return log.error('Error saving server list');

    if (debugEnabled) {
      log.debug('Server list saved');
    }

  });

};