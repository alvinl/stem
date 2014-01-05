
module.exports = function(sessionID) {
  
  var bot = this;
  var config = bot.config;
  var botTrade = bot.traderBot;

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

    bot._tradeReady = true;
    bot._webReady = true;

  });

};