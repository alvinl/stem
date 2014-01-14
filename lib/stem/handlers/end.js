
module.exports = function(status, getItems, bot, botTrade) {

  var log = bot.log;
  var config = bot.config;
  var debugEnabled = config.debug;
  var customEndMessage = (config.trade) ? config.trade.endMsg : false;

  // Reload the bots inventory
  botTrade.loadInventory(440, 2, function(inv) {

    // Error loading inventory
    if (!inv) {
      log.error('Error loading inventory. Reload inventory with: items reload');
      return;
    }

    if (debugEnabled) {
      log.debug('Inventory reloaded');
    }

    bot._inventory = inv;
    bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
    bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
    bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
    bot._invTradable = inv.filter(function(item) { return item.tradable;});

  });
  
  // Clear trade timer
  clearTimeout(bot._tradeTimer);

  if (status === 'complete') {

    getItems(function(items) {

      log.info('Trade completed');
      items.forEach(function(item) {
        log.info('Received: %s', item.name);
      });

      if (customEndMessage) {

        var tradedItems = items.length;

        bot.sendMessage(bot._tradeClient, customEndMessage
          .replace('%amountTraded', tradedItems));

      }

    });

  }

  else {

    log.warn('Trade %s', status);

  }

};