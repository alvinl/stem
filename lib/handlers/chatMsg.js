
module.exports = function(message, bot, botTrade) {
  
  var config = bot.config;
  var TradeCmd = require('./tradeCommands')(bot, botTrade);

  console.log('Trade message: %s', message);

  // Command: give all
  if (message === 'give all') {
    TradeCmd.giveAll();
  }

  // Command: give scrap
  else if (message === 'give scrap') {
    TradeCmd.giveScrap();
  }

  // Command: give rec(laimed)
  else if (message === 'give reclaimed' || message === 'give rec') {
    TradeCmd.giveRec();
  }

  // Command: give ref(ined)
  else if (message === 'give refined' || message === 'give ref') {
    TradeCmd.giveRef();
  }

  // Command: give keys
  else if (message === 'give keys') {
    TradeCmd.giveKeys();
  }

  // Command: help
  else if (message === 'help') {
    TradeCmd.help();
  }

};