var Steam = exports.steam = require('steam')
  , SteamTrade = exports.SteamTrade = require('steam-trade')
  , fs = require('fs')
  , handler = require('./handler.js')
  , config = require('./config.json')
  , log = require('./logger.js').log;

// Check for servers file
if (fs.existsSync('servers.json')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers.json'));
}

var username = config.username
  , password = config.password
  , bot = exports.bot = new Steam.SteamClient()
  , steamTrade = exports.steamTrade = new SteamTrade();

var steamGuard = require('fs').existsSync(config.username + '.hash') ? require('fs').readFileSync(config.username + '.hash') : '';

bot.logOn(username, password, steamGuard);

bot.on('loggedOn', handler.loggedOn);

bot.on('error', handler.error);

bot.on('message', handler.message);

bot.on('webSessionID', handler.webSession);

bot.on('sentry', handler.sentry);

bot.on('servers', handler.servers);


// Trade related events
bot.on('tradeProposed', handler.tradeProposed);

bot.on('sessionStart', handler.sessionStart);

steamTrade.on('offerChanged', handler.offerChanged);

steamTrade.on('ready', handler.ready);

steamTrade.on('end', handler.end);


// Debug
if (config.debug) {
  bot.on('debug', log.warn);
}