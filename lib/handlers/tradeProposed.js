
module.exports = function(tradeID, steamID) {
  
  var bot = this;
  var config = bot.config;
  var isTradeReady = bot._tradeReady;
  var username = bot.users[steamID].playerName;
  var denyMessage = config.tradeWhitelist.denyMessage || '';
  var whitelistIsEnabled = config.tradeWhitelist.enabled || false;
  var clientIsWhitelisted = (config.tradeWhitelist.whitelist.indexOf(steamID) > -1) ? true : false;

  if (!isTradeReady) {
    bot.respondToTrade(tradeID, false);
    console.log('Denying trade request from %s, not trade ready', steamID);
    return;
  }

  console.log('Trade has been proposed by: %s (%s)', username, steamID);

  // Whitelist enabled and client is whitelisted
  if (whitelistIsEnabled && clientIsWhitelisted) {

    bot.respondToTrade(tradeID, true);
    console.log('Accepted trade request');
    return;

  }

  // Client is NOT whitelisted
  else if (whitelistIsEnabled && !clientIsWhitelisted) {

    // There is a custom deny message
    if (denyMessage) {
      bot.respondToTrade(tradeID, false);
      console.log('Denied trade request');
      bot.sendMessage(steamID, denyMessage, 1);
      return;
    }

    bot.respondToTrade(tradeID, false);
    console.log('Denided trade request');
    return;

  }

  // Accept all trade requests by default
  bot.respondToTrade(tradeID, true);
  console.log('Accepted trade request');

};