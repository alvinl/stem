
module.exports = function() {

  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var idlingEnabled = config.idle;
  var customBotname = config.botname;
  var whitelistEnabled = (config.tradeWhitelist) ? config.tradeWhitelist.enabled : false;

  // Log successful login
  log.info('Bot successfully logged in');

  // Set bot status to 'Online'
  bot.setPersonaState(1);

  // Change botname if set in config
  if (customBotname) {
    log.info('Changing botname to: %s', customBotname);
    bot.setPersonaName(customBotname);
  }

  // Notify user if whitelist is enabled
  if (whitelistEnabled) {
    log.info('Trade whitelist is enabled');
  }

  // Start idling games if enabled
  if (idlingEnabled) {
    log.info('Idling:', config.idleGames);
    bot.gamesPlayed(config.idleGames);
  }

};