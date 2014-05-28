
module.exports = function (Stem) {
  
  return {

    /**
     * Attaches a handler to a given botType instance while passing `Stem`.
     * @param {Object}   botType   Bot type (bot / botTrade / botOffers)
     * @param {String}   eventName Name of the event to attach to
     * @param {Function} handler   Event handler
     */
    addHandler: function (botType, eventName, handler) {
      
      return botType.on(eventName, handler.bind(Stem));

    },

    /**
     * Returns whether or not a given SteamID is an admin.
     * @param  {String}  steamID SteamID to check
     * @return {Boolean}         Whether or not the user is an admin
     */
    isAdmin: function (steamID) {
     
      return ~Stem.config.admins.indexOf(steamID);

    },

    /**
     * Registers a normal command
     * @param {String}   command        String to be matched as a command
     * @param {Function} commandHandler Function to be called when command is called
     */
    addCommand: function (command, commandHandler) {

      // Check if the command isn't already registered
      if (Stem.commands.normal[command])
        throw new Error('Command `' + command + '` is already registered');

      // Make sure the second arg is a function
      else if (typeof(commandHandler) !== 'function')
        throw new Error('Command `'+ command +'` ' + 'should have a function as its second argument');
      
      Stem.commands.normal[command] = commandHandler;
      return;

    },

    /**
     * Registers a admin command
     * @param {String}   command        String to be matched as a command
     * @param {Function} commandHandler Function to be called when command is called
     */
    addAdminCommand: function (command, commandHandler) {

      // Check if the command isn't already registered
      if (Stem.commands.admin[command])
        throw new Error('Command `' + command + '` is already registered');

      // Make sure the second arg is a function
      else if (typeof(commandHandler) !== 'function')
        throw new Error('Command `' + command + '` ' + 'should have a function as its second argument');
      
      // Register admin command
      Stem.commands.admin[command] = commandHandler;
      return;

    },

    /**
     * Validates a steamID
     * @param  {String} steamID SteamID to validate
     * @return {Boolean}        Whether or not the SteamID is valid
     */
    validateSteamID: function (steamID) {
      
      if (!steamID || steamID.length !== 17 || isNaN(steamID)) return false;

      return true;

    }

  };

};