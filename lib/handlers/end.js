
module.exports = function(status, getItems, bot, botTrade) {

  var config = bot.config;
  var customEndMessage = (config.trade) ? config.trade.endMsg : false;
  
  // Clear trade timer
  clearTimeout(bot._tradeTimer);

  if (status === 'complete') {

    getItems(function(items) {

      console.log('Trade completed');
      items.forEach(function(item) {
        console.log('Received: %s', item.name);
      });

      if (customEndMessage) {

        var tradedItems = items.length;

        bot.sendMessage(bot._tradeClient, customEndMessage
          .replace('%amountTraded', tradedItems));

      }

    });

  }

  else {

    console.log('Trade: %s', status);

  }

};