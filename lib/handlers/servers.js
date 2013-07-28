
/*
 * 
 * servers handler
 *
 * - Description - 
 * Handles the event for when the bot receives the
 * list of new servers
 *
 */


// Import modules
var app = require('./../../app.js')
  , fs = require('fs');


// Servers event
module.exports = function(servers){

  // Write the servers to servers.json
  fs.writeFile('.servers.json', JSON.stringify(servers));

};