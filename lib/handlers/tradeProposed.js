
module.exports = function(tradeID, steamID) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var isTradeReady = bot._tradeReady;
  var username = bot.users[steamID].playerName;
  var denyMessage = (config.tradeWhitelist) ? config.tradeWhitelist.denyMessage : '';
  var whitelistIsEnabled = (config.tradeWhitelist) ? config.tradeWhitelist.enabled : false;
  var clientIsWhitelisted = (whitelistIsEnabled) ? (config.tradeWhitelist.whitelist.indexOf(steamID) > -1) : false;

  if (!isTradeReady) {
    bot.respondToTrade(tradeID, false);
    log.warn('Denying trade request from %s (%s), not trade ready', username, steamID);
    return;
  }

  log.warn('Trade has been proposed by: %s (%s)', username, steamID);

  // Whitelist enabled and client is whitelisted
  if (whitelistIsEnabled && clientIsWhitelisted) {

    bot.respondToTrade(tradeID, true);
    log.warn('Accepted trade request');
    return;

  }

  // Client is NOT whitelisted
  else if (whitelistIsEnabled && !clientIsWhitelisted) {

    // There is a custom deny message
    if (denyMessage) {
      bot.respondToTrade(tradeID, false);
      log.warn('Denied trade request');
      bot.sendMessage(steamID, denyMessage, 1);
      return;
    }

    bot.respondToTrade(tradeID, false);
    log.warn('Denided trade request');
    return;

  }

  // Accept all trade requests by default
  bot.respondToTrade(tradeID, true);
  log.warn('Accepted trade request');

};