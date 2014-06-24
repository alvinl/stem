
module.exports = function(Stem) {

  var addHandler = Stem.api.addHandler;

  addHandler('bot', 'webSessionID', require('./webSession'));

  addHandler('bot', 'friendMsg', require('./friendMsg'));

  addHandler('bot', 'loggedOn', require('./loggedOn'));

  addHandler('bot', 'servers', require('./servers'));

  addHandler('bot', 'sentry', require('./sentry'));

  addHandler('bot', 'error', require('./error'));

  addHandler('botTrade', 'error', require('./tradeError'));

};