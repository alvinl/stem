/*
 * 
 * trade error handler
 *
 * - Description - 
 * Handles the event for when the bot encounters
 * a error in-trade
 * 
 */


// Require modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Export module
module.exports = function (e) {
  log.error(e);
}