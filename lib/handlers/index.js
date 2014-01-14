
var tradeProposedHandler = require('./tradeProposed');
var offerChangedHandler = require('./offerChanged');
var sessionStartHandler = require('./sessionStart');
var relationshipHandler = require('./relationship');
var webSessionHandler = require('./webSession');
var tradeErrorHandler = require('./tradeError');
var loggedOnHandler = require('./loggedOn');
var serversHandler = require('./servers');
var messageHandler = require('./message');
var chatMsgHandler = require('./chatMsg');
var friendHandler = require('./friend');
var sentryHandler = require('./sentry');
var readyHandler = require('./ready');
var errorHandler = require('./error');
var endHandler = require('./end');

module.exports = function(bot, botTrade, botOffers) {

  /*
   *  Standard bot handlers
   */

  bot.on('relationships', relationshipHandler);

  bot.on('webSessionID', function(sessionID) {

    webSessionHandler(sessionID, bot, botTrade, botOffers);

  });

  bot.on('loggedOn', loggedOnHandler);

  bot.on('servers', serversHandler);

  bot.on('message', function(steamID, rawMessage, messageType, clientSteamID) {

    messageHandler(steamID, rawMessage, messageType, clientSteamID, bot, botTrade, botOffers);

  });

  bot.on('sentry', sentryHandler);

  bot.on('friend', friendHandler);

  bot.on('error', errorHandler);


  /*
   *  Trading related handlers
   */

  botTrade.on('offerChanged', function(change, item) {

    offerChangedHandler(change, item, bot, botTrade);

  });

  bot.on('tradeProposed', tradeProposedHandler);

  bot.on('sessionStart', function(steamID) {

    sessionStartHandler(steamID, bot, botTrade);
    
  });

  botTrade.on('chatMsg', function(message) {

    chatMsgHandler(message, bot, botTrade);

  });

  botTrade.on('ready', function() {

    readyHandler(bot, botTrade);

  });

  botTrade.on('end', function(status, getItems) {

    endHandler(status, getItems, bot, botTrade);

  });

  botTrade.on('error', function(error) {

    tradeErrorHandler(error, bot);

  });


};