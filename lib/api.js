
/**
 * A module that adds helper metheds to `Stem`
 *
 * @module StemAPI
 */

/**
 * Dependencies
 */

var request = require('request');

/**
 * Export `StemAPI`
 */

module.exports = StemAPI;

/**
 * Creates a new `StemAPI` instance
 * @class
 */
function StemAPI (stem) {

  this.stem    = stem;
  this._jar    = request.jar();
  this.request = request.defaults({ jar: this._jar });

}

/**
 * Finds a matching command and returns the commands details as
 * an object.
 *
 * @param  {String}  eventType Event type to match
 * @param  {Boolean} isAdmin   Should we search for admin only commands
 * @return {Object}            Details about the matched command
 */
StemAPI.prototype._matchCommand = function(message, eventType, isAdmin) {

  var stem = this.stem;

  // Check if the message matches any registered commands
  for (var i = stem.commands.length - 1; i >= 0; i--) {

    /**
     * Command listener details
     * @type {Object}
     */
    var listenerInfo = stem.commands[i];

    if (listenerInfo.eventType !== eventType)
      continue;

    // Admin command
    if (isAdmin && listenerInfo.permission === 'admin' && listenerInfo.listener.test(message))
      return listenerInfo;

    // Normal command
    else if (listenerInfo.permission === 'normal' && listenerInfo.listener.test(message))
      return listenerInfo;

  }

};

/**
 * Applies cookies to `api.request`
 *
 * @param {Array} cookies Cookies to be applied
 */
StemAPI.prototype.setupRequest = function(cookies) {

  var self = this;

  cookies.forEach(function (cookie) {

    self._jar.setCookie(request.cookie(cookie), 'http://steamcommunity.com');

  });

};

/**
 * Post a comment on a users profile
 *
 * @param  {String}   steamID User to post comment to
 * @param  {String}   comment Comment to post
 * @param  {Function} cb
 */
StemAPI.prototype.postComment = function(steamID, comment, cb) {

  var postURL = 'http://steamcommunity.com/comment/Profile/post/%steamID/-1/'
                .replace('%steamID', steamID),
      self    = this;

  self.request.post({ url: postURL, form: { comment: comment, count: 1, sessionid: self.stem.botTrade.sessionID }, json: true }, function (err, response, body) {

    if (err || body.error)
      return cb(err || new Error(body.error));

    // Comment was not posted
    else if (!body.success)
      return cb(null, false);

    return cb(null, true);

  });

};

/**
 * Checks if the given steamID is an admin.
 *
 * @param  {String}  steamID SteamID to check
 * @return {Boolean}         Whether or not the user is an admin
 */
StemAPI.prototype.isAdmin = function(steamID) {

  return (~this.stem.config.admins.indexOf(steamID)) ? true : false;

};

/**
 * Registers a new command
 *
 * @param {String}   command        String to be matched as a command
 * @param {Function} commandHandler Function to be called when command is called
 * @param {Boolean}  adminCommand   Should the command be for admins only
 */
StemAPI.prototype.addCommand = function(command, commandHandler, commandOptions) {

  var stem = this.stem;

  if (!(command instanceof RegExp))
    throw new TypeError('First parameter must be a RegeExp');

  else if (!(commandHandler instanceof Function))
    throw new TypeError('Second parameter must be a callback function');

  else if (commandOptions && !(commandOptions instanceof Object))
    throw new TypeError('Third parameter must be an object');

  commandOptions = commandOptions || {};

  /**
   * Valid permision scopes
   * @type {Array}
   */
  var validPermissions = ['admin', 'normal'];

  /**
   * Valid event types
   * @type {Array}
   */
  var validEventTypes = ['message', 'group', 'trade'];

  // Validate permission type
  if (commandOptions.hasOwnProperty('permission') && !~validPermissions.indexOf(commandOptions.permission))
    throw new Error('Invalid permission type: ' + commandOptions.permission);

  else if (commandOptions.hasOwnProperty('eventType') && !~validEventTypes.indexOf(commandOptions.eventType))
    throw new Error('Invalid event type: ' + commandOptions.eventType);

  /**
   * Is the command listener already registered
   * @type {Number}
   */
  var commandExists = stem.commands.filter(function (listenerInfo) {

    return (listenerInfo.listener.toString() === command.toString() &&
            (listenerInfo.eventType || 'message') === (commandOptions.eventType || 'message'));

  }).length;

  if (commandExists)
    throw new Error('Command `' + command + '` is already registered');

  stem.commands.push({ listener:     command,
                        handler:     commandHandler,
                        permission:  commandOptions.permission || 'normal',
                        eventType:   commandOptions.eventType || 'message' });

};

/**
 * Validates a 64bit steamID
 *
 * @param  {String} steamID SteamID to validate
 * @return {Boolean}        Whether or not the SteamID is valid
 */
StemAPI.prototype.validateSteamID = function(steamID) {

  if (!steamID || steamID.length !== 17 || isNaN(steamID))
    return false;

  return true;

};

/**
 * Attaches a handler to a given botType instance while passing `Stem` as `this`.
 *
 * @param {String}   botType   Bot type (bot / botTrade / stem)
 * @param {String}   eventName Event name
 * @param {Function} handler   Event handler
 */
StemAPI.prototype.addHandler = function(eventType, eventName, eventHandler) {

  var stem = this.stem;

  switch (eventType) {

    case 'bot':
      stem.bot.on(eventName, eventHandler.bind(stem));
      break;

    case 'botTrade':
      stem.botTrade.on(eventName, eventHandler.bind(stem));
      break;

    case 'stem':
      stem.on(eventName, eventHandler.bind(stem));
      break;

    default:
      throw new Error('Invalid event type: ' + eventType);

  }

};

/**
 * Validates items in the current trade session
 *
 * @return {Boolean} Whether or not the trade items are valid
 */
StemAPI.prototype.validateTrade = function() {

  var stem = this.stem;

  // Real items in trade do not match items we tracked from trade events
  // - This is usually due to trade lag
  if (!stem.trade.eventItems || !stem.botTrade.themAssets)
    return false;

  // Total items from real trade and trade events do not match
  else if (stem.trade.eventItems.length !== stem.botTrade.themAssets.length)
    return false;

  // Item positions do not match up
  for (var i = stem.trade.eventItems.length; i--;) {

    if (!~stem.botTrade.themAssets.indexOf(stem.trade.eventItems[i]))
      return false;

  }

  return true;

};
