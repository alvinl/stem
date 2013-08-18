
/*
 * 
 * friend handler
 *
 * - Description - 
 * Handles the event for when the bot's friends
 * list receives a change
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Friendship event
module.exports = function(steamID, status){

  var user = app.bot.users[steamID].playerName;

  // Friend request
  if (status === 2 && config.autoAccept) {

    log.warn('New friend: ' + user + ' (' + steamID + ')');
    // Accept friend request
    app.bot.addFriend(steamID);

  // Friend removed bot
  } else if (status === 0) {

    log.warn('Friend removed: ' + user + ' (' + steamID + ')');
    
  // Add the user if an admin
  } else if (config.admins.indexOf(steamID) > -1 && status === 2) {

    log.warn('Added Admin: ' + user + ' (' + steamID + ')');
    app.bot.addFriend(steamID);

  }

};