
/**
 * Dependencies
 */

var SteamTradeOffers = require('steam-tradeoffers'),
    package          = require('../package.json'),
    SteamTrade       = require('steam-trade'),
    Steam            = require('steam'),
    path             = require('path'),
    fs               = require('fs');

/**
 * Export `Stem`
 */

module.exports = Stem;

/**
 * `Stem` constructor
 */

function Stem() {

  this.path            = path.dirname(require.main.filename);
  this.bot             = new Steam.SteamClient();
  this.botOffers       = new SteamTradeOffers();
  this.botTrade        = new SteamTrade();
  this.version         = package.version;
  this.states          = {};
  this.trade           = {};
  this.configs         = {};
  this.commands        = {};
  this.commands.normal = {};
  this.commands.admin  = {};

}

/**
 * Initialize `Stem` with the provided config
 * 
 * @param  {Object} config
 */

Stem.prototype.init = function(config) {

  var Stem        = this,
      serverList  = this.path + '/.servers';

  this.config = config;
  this.api    = require('./api')(this);
  this.log    = require('./logger')(config);

  // Check if config is an object
  if (typeof(config) !== 'object') {

    Stem.log.error('Invalid config');
    return process.kill();

  }

  // Check that password and username exist.
  if (!config.username || !config.password) {

    Stem.log.error('Check that your Steam username / Steam password is set correctly.');
    return process.kill();

  }

  // If a servers file exists, use it.
  if (fs.existsSync(serverList) ) {

    // Attempt to parse the serverlist file
    try {

      Steam.servers = JSON.parse(fs.readFileSync(serverList));

    } 

    // Error parsing serverlist.
    catch (e) {

      Stem.log.error('Error parsing serverlist:', e);

    }

  }

  // Attempt to login
  this._login(config.username, config.password);

};

/**
 * Attempts to login the bot
 * 
 * @param  {String} username Bots username
 * @param  {String} password Bots password
 */

Stem.prototype._login = function(username, password) {

  var sentryPath = this.path + '/.' + username,
      Stem       = this;

  // Login
  this.bot.logOn({

    accountName:   username,
    password:      password,
    shaSentryfile: (fs.existsSync(sentryPath)) ? fs.readFileSync(sentryPath) : null

  });

  // Initiate core handlers
  require('./handlers')(this);

  var pluginsFileExists = fs.existsSync(Stem.path + '/plugins.json'),
      pluginList;

  // Don't attempt to load the plugins file if it doesn't exist
  if (!pluginsFileExists) return;

  // Attempt to the load plugins file
  try {

    pluginList = require(this.path + '/plugins');    

  }

  // Error loading plugins file
  catch (e) {

    Stem.log.error('Error loading plugins file (%s)', e.message);
    return;

  }   

  // Don't attempt to load plugins if user has no plugins listed
  if (!Object.keys(pluginList).length) return;

  for (var plugin in pluginList) {

    // Skip disabled plugins
    if (pluginList[plugin].disabled) continue;

    // Set plugin specific config
    Stem.configs[plugin] = pluginList[plugin];

    // Attempt to load plugin
    try {

      // Load plugin
      require(plugin)(Stem);

    } 

    // Error loading plugin
    catch (e) {

      // Cleanup plugin config
      delete Stem.config[plugin];

      Stem.log.error('Failed to load plugin: %s (%s)', plugin, e.message);
      continue;

    }

    // Log plugin load
    Stem.log.info('Plugin loaded:', plugin);

  }

};
