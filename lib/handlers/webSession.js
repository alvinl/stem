
/*
 * 
 * tradeProposed handler
 *
 * - Description - 
 * Handles the event for when the bot receives a new
 * web session
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Web session event
module.exports = function(sessionID){

  // Set the sessionID to use steamTrade
  app.botTrade.sessionID = sessionID;

  // Log in to get cookies
  app.bot.webLogOn(function(cookies) {

    // Apply cookies
    cookies.forEach(function(cookie) {
      app.botTrade.setCookie(cookie);
    });

    log.info('Ready to trade');

    // Notify user if scrapbank is enabled
    if (config.scrapbank) {
      log.info('Scrapbanking enabled');
    }
    // This is needed to avoid conflicts
    app.tradeReady = true;
    app.webReady = true;
  });

};