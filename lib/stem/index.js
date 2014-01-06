
var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');
var steamBot = new Steam.SteamClient();
var steamTrade = new SteamTrade();
var packageInfo = require('../../package.json');

function Stem() {}

Stem.prototype.init = function(config) {

  var serversPath = __dirname + '/../../.servers';
  var debugEnabled = config.debug;

  // Check that password and username exist.
  if (!config.username || !config.password) {
    console.error('Check that your steam username or steam password is set correctly.');
    process.kill();
  }

  // Save configs
  steamBot.config = config;
  steamBot.config.version = packageInfo.version;

  // Add methods to steamBot
  require('./botHelpers')(steamBot);

  // If a servers file exists use it.
  if (fs.existsSync(serversPath) ) {

    if (debugEnabled) {
      steamBot.log.debug('Using cached server list');
    }

    // Attempt to parse the serverlist file
    try {
      Steam.servers = JSON.parse(fs.readFileSync(serversPath));
    } catch (e) {
      steamBot.log.error('Error parsing serverlist:', e);
    }

  }

  var username = config.username;
  var password = config.password;

  // Attempt to login
  this._login(username, password);

};

Stem.prototype._login = function(username, password) {

  var sentryPath = __dirname + '/../../.' + username;

  // Login
  steamBot.logOn({

    accountName: username,
    password: password,
    shaSentryfile: (fs.existsSync(sentryPath)) ? fs.readFileSync(sentryPath) : null

  });

  // Initiate the bot handlers
  require('../handlers')(steamBot, steamTrade);

};

module.exports = new Stem();