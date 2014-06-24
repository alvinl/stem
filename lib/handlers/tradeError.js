
module.exports = function (err) {

  var Stem      = this,
      bot       = this.bot,
      botTrade  = this.botTrade,
      botOffers = this.botOffers;

  Stem.log.error(err.message);

  // Change trading state
  Stem.states.tradeReady = false;

  // Change community state
  Stem.states.communityReady = false;

  bot.webLogOn(function (cookies) {

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
    botOffers.setup(botTrade.sessionID, cookies);

    Stem.emit('communityReady');

  });

};