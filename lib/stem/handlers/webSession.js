
module.exports = function(sessionID, bot, botTrade, botOffers) {
  
  var log = bot.log;
  var config = bot.config;
  var debugEnabled = config.debug;
  var scrapbankingEnabled = config.scrapbank;

  botTrade.sessionID = sessionID;

  bot.webLogOn(function(cookies) {
  
    // Apply cookies
    cookies.forEach(function(cookie) {
      botTrade.setCookie(cookie);
    });

    log.info('Bot is ready to trade');

    if (scrapbankingEnabled) {
      log.info('Scrapbanking enabled');
    }

    // Setup trade offers
    botOffers.setup(sessionID, cookies);

    // Refresh the bots inventory
    botTrade.loadInventory(440, 2, function(inv) {

      bot._tradeReady = true;
      bot._webReady = true;

      // Error loading inventory
      if (!inv) {
        log.error('Error loading inventory. Reload inventory with: items reload');
        return;
      }

      bot._inventory = inv;
      bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
      bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
      bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
      bot._invTradable = inv.filter(function(item) { return item.tradable;});

      if (debugEnabled) {
        log.debug('Inventory loaded');
      }

    });

  });

};