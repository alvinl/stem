
/*
 * 
 * tradeProposed handler
 *
 * - Description - 
 * Handles the event for when a new trade has been
 * proposed to the bot
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Trade proposed event
module.exports = function(tradeID, otherClient){

  // If the bot hasn't logged in, deny all trade requests
  if (!app.tradeReady) {
    app.bot.respondToTrade(tradeID, false);
    log.warn('Denying trade request from ' + otherClient + ', not ready to trade');
  // Bot has logged in and can trade
  } else {
    // Notify that a new trade has been proposed
    log.warn('Trade has been proposed by: %s (%s)', app.bot.users[otherClient].playerName, otherClient);
    // Check if whitelist is on
    if (config.tradeWhitelist.enabled) {
      // Check if user is on the whitelist
      if (config.tradeWhitelist.whitelist.indexOf(otherClient) > -1) {
        app.bot.respondToTrade(tradeID, true);
        log.info('Accepted trade request');
      // User is not on the whitelist
      } else {
        // Check if there's a custom deny message
        if (config.tradeWhitelist.denyMessage) {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
          app.Message(otherClient, config.tradeWhitelist.denyMessage);
        // If there's no custom deny message just deny the request
        } else {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
        }
      }
    // If whitelist isn't on just accept all trade requests
    } else {
      app.bot.respondToTrade(tradeID, true);
      log.info('Accepted trade request');
    }
  }

};