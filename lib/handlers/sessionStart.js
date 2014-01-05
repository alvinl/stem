
module.exports = function(steamID) {
  
  var bot = this;
  var config = bot.config;
  var botTrade = bot.traderBot;
  var tradeTimerEnabled = config.timeout;
  var username = bot.users[steamID].playerName;
  var welcomeMessage = config.trade.welcomeMsg || '';
  var isNonAdmin = (config.admins.indexOf(steamID) === -1);
  var tradeTimerLength = (tradeTimerEnabled) ? config.timeout * 1000 : null;

  // Reset invs
  bot._tradeClient = steamID;
  bot._addedScrap = [];
  bot._inventory = [];
  bot._clientInv = [];
  bot._invWeps = 0;

  // Clear any previous trade timers
  clearTimeout(bot._tradeTimer);

  // Start trade timer if enabled and client isn't an admin
  if (tradeTimerEnabled && isNonAdmin) {

    bot._tradeTimer = setTimeout(function() {
      botTrade.cancel(function() {
        console.log('Client took too long, cancelling trade');
      });
    }, tradeTimerLength);

  }

  console.log('Started trading %s (%s)', username, steamID);

  // Start the trade
  botTrade.open(steamID);

  // Refresh the bots inventory
  botTrade.loadInventory(440, 2, function(inv) {

    bot._inventory = inv;
    bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
    bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
    bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
    bot._invTradable = inv.filter(function(item) { return item.tradable;});

    // Custom trade message
    if (welcomeMessage) {
      botTrade.chatMsg(welcomeMessage
        .replace('%scrap', bot._invScrap.length)
        .replace('%reclaimed', bot._invRec.length)
        .replace('%refined', bot._invRef.length)
        .replace('%items', bot._invTradable.length));  
    }

  });


};