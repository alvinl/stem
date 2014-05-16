
module.exports = function(serverlist) {
  
  var log         = this.log,
      fs          = require('fs'),
      serversPath = this.path + '/.servers';

  // Save the server list
  fs.writeFile(serversPath, JSON.stringify(serverlist), function (err) {

    // Error saving server list
    if (err) return log.error('Error saving server list');

  });

};