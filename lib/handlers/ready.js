
module.exports = function(bot, botTrade) {
  
  var log = bot.log;

  log.info('Validating items in trade');

  // Validate items from trade
  if (bot.validateTradeItems(bot._clientInv, botTrade.themAssets)) {

    log.warn('Confirming trade');
    botTrade.ready(function(){
      botTrade.confirm();
    });

  }

  // Error validating items in trade
  else {

    log.error('Items in trade do not match, cancelling trade');
    botTrade.cancel();

  }

};