
var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');
var steamBot = new Steam.SteamClient();
var steamTrade = new SteamTrade();
var packageInfo = require('../../package.json');

function Stem() {}

Stem.prototype.init = function(config) {

  var serversPath = __dirname + '/../../.servers';

  // Check that password and username exist.
  if (!config.username || !config.password) {
    console.error('Check that your steam username or steam password is set correctly.');
    process.kill();
  }

  // If a servers file exists use it.
  if (fs.existsSync(serversPath) ) {
    // TODO: use try to catch json parse errors
    // TODO: add debug info here
    Steam.servers = JSON.parse(fs.readFileSync(serversPath));
  }

  var username = config.username;
  var password = config.password;

  // Attempt to login
  this._login(username, password);

  // Save the config
  steamBot.config = config;
  steamBot.config.version = packageInfo.version;

  // Attach steamTrade to steamBot
  steamBot.traderBot = steamTrade;

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

steamBot.validate = function(arr1, arr2) {

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

module.exports = new Stem();