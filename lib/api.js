
var request = require('request');

module.exports = function (Stem) {

  var _jar = request.jar();
  
  return {

    request: request.defaults({ jar: _jar }),

    /**
     * Applies cookies to api.request
     * 
     * @param {Array} cookies Cookies to be applied
     */
    setupRequest: function (cookies) {
      
      cookies.forEach(function (cookie) {
        
        _jar.setCookie(request.cookie(cookie), 'http://steamcommunity.com');

      });

      return;

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
     * Registers a command
     * 
     * @param {String}   command        String to be matched as a command
     * @param {Function} commandHandler Function to be called when command is called
     * @param {Boolean}  adminCommand   Should the command be for admins only
     */
    addCommand: function (command, commandHandler, adminCommand) {

      var commandType = (adminCommand) ? 'admin' : 'normal';

      // Check if the command isn't already registered
      if (Stem.commands[commandType][command]) {

        throw new Error('Command `' + command + '` is already registered');

      }

      // Make sure the second arg is a function
      else if (typeof(commandHandler) !== 'function') {

        throw new Error('Command `'+ command +'` ' + 'should have a function as its second argument');

      }
      
      Stem.commands[commandType][command] = commandHandler;
      return;

    },

    /**
     * Registers a trade command
     * 
     * @param {String}   command        String to be matched as a command
     * @param {Function} commandHandler Function to be called when command is called
     * @param {Boolean}  adminCommand   Should the command be for admins only
     */
    addTradeCommand: function (command, commandHandler, adminCommand) {
      
      var commandType = (adminCommand) ? 'admin' : 'normal';

      // Check if the trade command isn't already registered
      if (Stem.tradeCommands[commandType][command]) {

        throw new Error('Trade command `' + command + '` is already registered');

      }

      // Make sure the second arg is a function
      else if (typeof(commandHandler) !== 'function') {

        throw new Error('Trade command `'+ command +'` ' + 'should have a function as its second argument');

      }
      
      Stem.tradeCommands[commandType][command] = commandHandler;
      return;

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