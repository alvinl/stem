
module.exports = function(bot, botTrade) {
  
  console.log('Validating items');

  // Validate items from trade
  if (bot.validate(bot._clientInv, botTrade.themAssets)) {

    console.log('Confirming trade');
    botTrade.ready(function(){
      botTrade.confirm();
    });

  }

  // Error validating items in trade
  else {

    console.log('Items in trade do not match, cancelling trade');
    botTrade.cancel();

  }

};