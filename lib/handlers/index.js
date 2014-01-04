
var relationshipHandler = require('./relationship');
var loggedOnHandler = require('./loggedOn');
var serversHandler = require('./servers');
var messageHandler = require('./message');
var friendHandler = require('./friend');
var sentryHandler = require('./sentry');
var errorHandler = require('./error');

module.exports = function(bot) {

  bot.on('relationships', relationshipHandler);

  bot.on('loggedOn', loggedOnHandler);

  bot.on('servers', serversHandler);

  bot.on('message', messageHandler);

  bot.on('sentry', sentryHandler);

  bot.on('friend', friendHandler);

  bot.on('error', errorHandler);

};