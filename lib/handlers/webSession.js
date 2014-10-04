
module.exports = function(sessionID) {

  var Stem      = this,
      bot       = this.bot,
      botTrade  = this.botTrade,
      botOffers = this.botOffers;

  // Save sessionID
  botTrade.sessionID = sessionID;

  // Login to Steam Community
  bot.webLogOn(function(cookies) {

    // Apply cookies to `botTrade`
    cookies.forEach(function(cookie) {

      botTrade.setCookie(cookie);

    });

    // Apply cookies to api.request
    Stem.api.setupRequest(cookies);

    // Change trading state
    Stem.states.tradeReady = true;

    // Change community state
    Stem.states.communityReady = true;

    // Setup trade offers
    botOffers.setup(sessionID, cookies, function (err) {

      if (err)
        Stem.log.error('Error setting up trade offers:', err.message);

      Stem.emit('communityReady');

    });

  });

};
