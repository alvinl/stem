
// Import modules
var Steam = exports.Steam = require('steam')
  , SteamTrade = exports.SteamTrade = require('steam-trade')
  , config = require('./config.json')
  , log = require('./lib/logger.js')
  , fs = require('fs');

// Set and export bot configs
var username = config.username
  , botPassword = config.password
  , sentry = '.' + config.username
  , bot = exports.bot = new Steam.SteamClient()
  , botTrade = exports.botTrade = new SteamTrade();


// Set global variables
var inventory = exports.inventory
  , scrap = exports.scrap
  , weapons = exports.weapons
  , addedScrap = exports.addedScrap
  , client = exports.client
  , clientInv = exports.clientInv = []
  , tradeReady = exports.tradeReady = false
  , tradeTimer = exports.tradeTimer;


// Check for servers file
if (fs.existsSync('.servers.json')) {
  Steam.servers = JSON.parse(fs.readFileSync('.servers.json'));
}


// Import handlers
var tradeProposedHandler = require('./lib/handlers/tradeProposed')
  , offerChangedHandler = require('./lib/handlers/offerChanged')
  , sessionStartHandler = require('./lib/handlers/sessionStart')
  , webSessionHandler = require('./lib/handlers/webSession')
  , loggedOnHandler = require('./lib/handlers/loggedOn')
  , serversHandler = require('./lib/handlers/servers')
  , messageHandler = require('./lib/handlers/message')
  , chatMsgHandler = require('./lib/handlers/chatMsg')
  , sentryHandler = require('./lib/handlers/sentry')
  , friendHandler = require('./lib/handlers/friend')
  , errorHandler = require('./lib/handlers/error')
  , readyHandler = require('./lib/handlers/ready')
  , endHandler = require('./lib/handlers/end');


// Attempt to login
if (require('fs').existsSync(sentry)) {
  bot.logOn({
    accountName: username,
    password: botPassword,
    shaSentryfile: require('fs').readFileSync(sentry)
  });
} else {
  bot.logOn({
    accountName: username,
    password: botPassword
  });
}


// Bot events
bot.on('loggedOn', loggedOnHandler);

bot.on('error', errorHandler);

bot.on('message', messageHandler);

bot.on('webSessionID', webSessionHandler);

bot.on('sentry', sentryHandler);

bot.on('servers', serversHandler);

bot.on('friend', friendHandler);


// Trade related events
bot.on('tradeProposed', tradeProposedHandler);

bot.on('sessionStart', sessionStartHandler);

botTrade.on('offerChanged', offerChangedHandler);

botTrade.on('chatMsg', chatMsgHandler);

botTrade.on('ready', readyHandler);

botTrade.on('end', endHandler);


// Debug
if (config.debug) {
  bot.on('debug', log.warn);
}


/*
 * General functions
 */


// Validate arrays
exports.Validate = function Validate(arr1, arr2){
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};


// Send message
exports.Message = function Message(to, message){
  bot.sendMessage(to, message, Steam.EChatEntryType.ChatMsg);
};