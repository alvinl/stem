
module.exports = function(status, getItems, bot, botTrade) {

  var log = bot.log;
  var config = bot.config;
  var customEndMessage = (config.trade) ? config.trade.endMsg : false;
  
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