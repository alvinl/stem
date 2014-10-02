
var request = require('request');

module.exports = function (Stem) {

  var _jar = request.jar();

  return {

    request: request.defaults({ jar: _jar }),

    /**
     * Finds a matching command and returns the commands details as
     * an object.
     *
     * @param  {String}  eventType Event type to search for
     * @param  {Boolean} isAdmin
     * @return {Object}            Details about the matched command
     */
    _matchCommand: function (message, eventType, isAdmin) {

      // Check if the message matches any registered commands
      for (var i = Stem.commands.length - 1; i >= 0; i--) {

        /**
         * Command listener details
         * @type {Object}
         */
        var listenerInfo = Stem.commands[i];

        if (listenerInfo.eventType !== eventType)
          continue;

        // Admin command
        if (isAdmin && listenerInfo.permission === 'admin' && listenerInfo.listener.test(message))
          return listenerInfo;

        // Normal command
        else if (listenerInfo.permission === 'normal' && listenerInfo.listener.test(message))
          return listenerInfo;

      }

    },

    /**
     * Applies cookies to api.request
     *
     * @param {Array} cookies Cookies to be applied
     */
    setupRequest: function (cookies) {

      cookies.forEach(function (cookie) {

        _jar.setCookieSync(request.cookie(cookie), 'http://steamcommunity.com');

      });

    },

    /**
     * Post a comment to a users profile
     *
     * @param  {String}   steamID User to post a comment to
     * @param  {String}   comment Comment to post
     * @param  {Function} cb
     */
    postComment: function (steamID, comment, cb) {

      var postURL = 'http://steamcommunity.com/comment/Profile/post/%steamID/-1/'
                      .replace('%steamID', steamID);

      this.request.post({ url: postURL, form: { comment: comment, count: 1, sessionid: Stem.botTrade.sessionID }, json: true }, function (err, response, body) {

        if (err || body.error) {

          return cb(err || body.error);

        }

        if (!body.success) {

          return cb(null, false);

        }

        return cb(null, true);

      });

    },

    /**
     * Returns whether or not a given SteamID is an admin.
     *
     * @param  {String}  steamID SteamID to check
     * @return {Boolean}         Whether or not the user is an admin
     */
    isAdmin: function (steamID) {

      // Convert number to `true` / `false`
      var isAdmin = (~Stem.config.admins.indexOf(steamID)) ? true : false;

      return isAdmin;

    },

    /**
     * Registers a new command
     *
     * @param {String}   command        String to be matched as a command
     * @param {Function} commandHandler Function to be called when command is called
     * @param {Boolean}  adminCommand   Should the command be for admins only
     */
    addCommand: function (command, commandHandler, commandOptions) {

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
      var commandExists = Stem.commands.filter(function (listenerInfo) {

        return (listenerInfo.listener.toString() === command.toString() &&
                (listenerInfo.eventType || 'message') === (commandOptions.eventType || 'message'));

      }).length;

      if (commandExists)
        throw new Error('Command `' + command + '` is already registered');

      Stem.commands.push({ listener:     command,
                            handler:     commandHandler,
                            permission:  commandOptions.permission || 'normal',
                            eventType:   commandOptions.eventType || 'message' });

    },

    /**
     * Validates a steamID
     *
     * @param  {String} steamID SteamID to validate
     * @return {Boolean}        Whether or not the SteamID is valid
     */
    validateSteamID: function (steamID) {

      if (!steamID || steamID.length !== 17 || isNaN(steamID)) {

        return false;

      }

      return true;

    },

    /**
     * Attaches a handler to a given botType instance while passing `Stem` as `this`.
     *
     * @param {String}   botType   Bot type (bot / botTrade / stem)
     * @param {String}   eventName Event name
     * @param {Function} handler   Event handler
     */
    addHandler: function (eventType, eventName, eventHandler) {

      switch (eventType) {

        case 'bot':
          Stem.bot.on(eventName, eventHandler.bind(Stem));
          break;

        case 'botTrade':
          Stem.botTrade.on(eventName, eventHandler.bind(Stem));
          break;

        case 'stem':
          Stem.on(eventName, eventHandler.bind(Stem));
          break;

        default:
          throw new Error('Invalid event type: ' + eventType);

      }

    },

    /**
     * Validates items in the current trade session
     *
     * @return {Boolean} Whether or not the trade items are valid
     */
    validateTrade: function () {

      if (!Stem.trade.eventItems || !Stem.botTrade.themAssets) {

        return false;

      }

      if (Stem.trade.eventItems.length !== Stem.botTrade.themAssets.length) {

        return false;

      }

      for (var i = Stem.trade.eventItems.length; i--;) {

        if (!~Stem.botTrade.themAssets.indexOf(Stem.trade.eventItems[i])) {

          return false;

        }

      }

      return true;

    }

  };

};
