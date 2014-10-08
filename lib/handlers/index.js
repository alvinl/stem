
module.exports = function(Stem) {

  /**
   * General handlers
   */

  Stem.api.addHandler('bot', 'sessionStart', require('./sessionStart'));

  Stem.api.addHandler('bot', 'webSessionID', require('./webSession'));

  Stem.api.addHandler('bot', 'friendMsg', require('./friendMsg'));

  Stem.api.addHandler('bot', 'loggedOn', require('./loggedOn'));

  Stem.api.addHandler('bot', 'servers', require('./servers'));

  Stem.api.addHandler('bot', 'chatMsg', require('./chatMsg'));

  Stem.api.addHandler('bot', 'sentry', require('./sentry'));

  Stem.api.addHandler('bot', 'error', require('./error'));

  /**
   * Trade related handlers
   */

  Stem.api.addHandler('botTrade', 'offerChanged', require('./offerChanged'));

  Stem.api.addHandler('botTrade', 'error', require('./tradeError'));

  Stem.api.addHandler('botTrade', 'chatMsg', require('./tradeMsg'));

};
