
var fs = require('fs');
var Steam = require('steam');
var steamBot = new Steam.SteamClient();
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
  require('../handlers')(steamBot);

};

module.exports = new Stem();