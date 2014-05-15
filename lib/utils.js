
module.exports = function (Stem) {
  
  return {

    /**
     * Attaches a handler to a given botType instance while passing `Stem`.
     * @param {Object} botType   Bot type (bot / botTrade / botOffers)
     * @param {String} eventName Name of the event to attach to
     * @param {Object} handler   Event handler
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

    }

  };

};