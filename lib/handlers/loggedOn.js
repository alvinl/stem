
/*
 * 
 * loggedOn handler
 *
 * - Description - 
 * Handles the event for when the bot logs in
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Logged on event
module.exports = function(){

  // Log successful login 
  log.info('Bot logged in');

  // Set bot status to "Online"
  app.bot.setPersonaState(app.Steam.EPersonaState.Online);

  // Check for botname in config
  if (config.botname) {
    log.info('Changing botname to: ' + config.botname);
    // Change bot's username
    app.bot.setPersonaName(config.botname);
  }

  // Notify user if whitelist is enabled
  if (config.tradeWhitelist.enabled) {
    log.info('Trade whitelist is enabled');
  }

  // Check if idling is enabled
  if (config.idle) {
    log.info('Idling: ' + config.idleGames);
    // Idle games in config
    app.bot.gamesPlayed(config.idleGames);
  }

};