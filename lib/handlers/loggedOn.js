
module.exports = function() {

  var bot = this;
  var config = bot.config;

  // Log successful login
  console.log('Bot logged in');

  // Set bot status to 'Online'
  bot.setPersonaState(1);

  // Change botname if set in config
  if (config.botname) {
    console.log('Changing botname to: %s', config.botname);
    bot.setPersonaName(config.botname);
  }

  // Notify user if whitelist is enabled
  if (config.tradeWhitelist.enabled) {
    console.info('Trade whitelist is enabled');
  }

  // Start idling games if enabled
  if (config.idle) {
    console.log('Idling: %s', config.idleGames);
    bot.gamesPlayed(config.idleGames);
  }

};