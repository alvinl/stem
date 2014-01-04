
var fs = require('fs');

module.exports = function(serverlist) {
  
  var bot = this;
  var config = bot.config;
  var serversPath = __dirname + '/../../.servers';

  // Log that we're saving the server list if debug is on
  if (config.debug) {
    console.log('Saving server list');
  }

  // Save the serverlist
  // TODO: add error handling
  fs.writeFile(serversPath, JSON.stringify(serverlist));

};