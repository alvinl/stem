
module.exports = function(sessionID) {

  var Stem      = this,
      bot       = this.bot,
      botTrade  = this.botTrade,
      botOffers = this.botOffers;

  // Save sessionID
  botTrade.sessionID = sessionID;

  // Login to Steam Community
  bot.webLogOn(function(cookies) {
  
    // Apply cookies
    cookies.forEach(function(cookie) {

      botTrade.setCookie(cookie);

    });

    // Change trading state
    Stem.states.tradeReady = true;

    // Setup trade offers
    botOffers.setup(sessionID, cookies);

  });

};