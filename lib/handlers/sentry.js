
/*
 * 
 * sentry handler
 *
 * - Description - 
 * Handles the event for when the bot receives a new
 * hash from steam
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js')
  , fs = require('fs');


// Sentry event
module.exports = function(hash){

  // Save sentry to botusername.hash
  fs.writeFile('.' + config.username, hash, function(err) {
    if (!err) {
      log.warn('Sentry saved!');
    // Error saving sentry
    } else {
      log.error('Failed to save sentry %s', err);
    }
  });

};