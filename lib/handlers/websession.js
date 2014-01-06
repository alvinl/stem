
module.exports = function(sessionID, bot, botTrade) {
  
  var config = bot.config;

  botTrade.sessionID = sessionID;

  bot.webLogOn(function(cookies) {
  
    // Apply cookies
    cookies.forEach(function(cookie) {
      botTrade.setCookie(cookie);
    });

    console.log('Ready to trade');

    if (config.scrapbank) {
      console.log('Scrapbanking enabled');
    }

    // Refresh the bots inventory
    botTrade.loadInventory(440, 2, function(inv) {

      bot._inventory = inv;
      bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
      bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
      bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
      bot._invTradable = inv.filter(function(item) { return item.tradable;});

      bot._tradeReady = true;
      bot._webReady = true;

      if (bot.config.debug) {
        console.log('Inventory loaded');
      }

    });

  });

};