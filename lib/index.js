
/**
 * Dependencies
 */

var EventEmitter     = require('events').EventEmitter,
    SteamTradeOffers = require('steam-tradeoffers'),
    package          = require('../package.json'),
    SteamTrade       = require('steam-trade'),
    Steam            = require('steam'),
    util             = require('util'),
    fs               = require('fs');

/**
 * Export `Stem`
 */

module.exports = Stem;

util.inherits(Stem, EventEmitter);

/**
 * Creates a `Stem` instance
 * @class
 */
function Stem() {

  this.bot             = new Steam.SteamClient();
  this.api             = require('./api')(this);
  this.botOffers       = new SteamTradeOffers();
  this.botTrade        = new SteamTrade();
  this.version         = package.version;
  this.path            = process.cwd();
  this.loadedPlugins   = [];
  this.config          = {};
  this.states          = {};
  this.trade           = {};
  this.configs         = {};
  this.inventories     = {};

  this.tradeCommands = {

    normal: {},
    admin:  {}

  };

  this.commands = {

    normal: {},
    admin:  {}

  };

  EventEmitter.call(this);

}

/**
 * Initialize `Stem` with the provided config
 *
 * @param  {Object} config Config to use
 */
Stem.prototype.init = function(config) {

  var Stem        = this,
      serverList  = this.path + '/.servers';

  this.config = config;
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

  /**
   * Does the user have plugins to load
   *
   * @type {Boolean}
   */
  var isTherePlugins = (Stem.config.plugins) ?
                       Stem.config.plugins.length :
                       false;

  /**
   * Array of disabled plugins
   *
   * @type {Array}
   */
  var disabledPlugins = Stem.config.disabledPlugins || [];

  // Initiate core handlers
  require('./handlers')(this);

  // Load plugins if needed
  if (isTherePlugins) {

    Stem.config.plugins.forEach(function (pluginName) {

      // Skip disabled plugins and plugins already loaded
      if (~disabledPlugins.indexOf(pluginName) ||
          ~Stem.loadedPlugins.indexOf(pluginName))
        return;

      // Attempt to load plugin
      try {

        require(pluginName)(Stem);

      }

      // Error loading plugin
      catch (e) {

        Stem.log.error('Failed to load plugin: %s (%s)', pluginName, e.message);
        return;

      }

      // Mark plugin as loaded
      Stem.loadedPlugins.push(pluginName);

      // Log plugin load
      Stem.log.info('Plugin loaded:', pluginName);

    });

  }

  // Login
  this.bot.logOn({

    accountName:   username,
    password:      password,
    shaSentryfile: (fs.existsSync(sentryPath)) ? fs.readFileSync(sentryPath) : null

  });

};
