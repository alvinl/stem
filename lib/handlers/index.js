
module.exports = function(Stem) {

  var addHandler = Stem.api.addHandler;

  /**
   * General handlers
   */

  addHandler('bot', 'sessionStart', require('./sessionStart'));

  addHandler('bot', 'webSessionID', require('./webSession'));

  addHandler('bot', 'friendMsg', require('./friendMsg'));

  addHandler('bot', 'loggedOn', require('./loggedOn'));

  addHandler('bot', 'servers', require('./servers'));

  addHandler('bot', 'chatMsg', require('./chatMsg'));

  addHandler('bot', 'sentry', require('./sentry'));

  addHandler('bot', 'error', require('./error'));

  /**
   * Trade related handlers
   */

  addHandler('botTrade', 'offerChanged', require('./offerChanged'));

  addHandler('botTrade', 'error', require('./tradeError'));

  addHandler('botTrade', 'chatMsg', require('./tradeMsg'));

};
