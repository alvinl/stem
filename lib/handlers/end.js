
/*
 * 
 * end handler
 *
 * - Description - 
 * Handles the event for when the bot completes
 * a trade
 * 
 */


// Import modules
var app = require('./../../app.js')
  , log = require('./../logger.js');


// End event
module.exports = function(status, getItems){

  // Clear the trade timer
  clearTimeout(app.tradeTimer);

  // Log items received
  if (status === 'complete') {
    getItems(function(items){
      log.warn('Trade completed');
      items.forEach(function(item) {
        log.warn('Received: ' + item.name);
      });
    });
  // Log other trade status's
  } else {
    log.warn('Trade: ' + status);
  }

};