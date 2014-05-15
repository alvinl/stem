
module.exports = function(Stem) {

  var Utils = Stem.utils,
      bot   = Stem.bot;

  Utils.addHandler(bot, 'webSessionID', require('./webSession'));

  Utils.addHandler(bot, 'friendMsg', require('./friendMsg'));

  Utils.addHandler(bot, 'loggedOn', require('./loggedOn'));

  Utils.addHandler(bot, 'servers', require('./servers'));

  Utils.addHandler(bot, 'sentry', require('./sentry'));

  Utils.addHandler(bot, 'error', require('./error'));

};