
/*
 * 
 * ready handler
 *
 * - Description - 
 * Handles the event for when a user ready's up
 * during a trade
 * 
 */


// Import modules
var app = require('./../../app.js')
  , log = require('./../logger.js');


// Ready event
module.exports = function(){
  log.info('Validating items');

  // Validate items in trade
  if (app.Validate(app.clientInv, app.botTrade.themAssets)) {
    log.info('Confirming');
    app.botTrade.ready(function(){
      app.botTrade.confirm();
    });
  // Items are not valid
  } else {
    log.error("Items in trade do not match, cancelling trade");
    app.botTrade.cancel();
  }

};