
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
  , log = require('./../logger.js')
  , config = require('./../../config.json');


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
    if (config.trade.endMsg) {
      getItems(function(items) {
        var amountTraded = items.length;
        app.Message(app.client, config.trade.endMsg
          .replace('%amountTraded', amountTraded));
      });
    }
  // Log other trade status's
  } else {
    log.warn('Trade: ' + status);
  }

};