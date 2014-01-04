
module.exports = function(steamID, status) {
  
  var bot = this;
  var config = bot.config;
  var autoAcceptEnabled = config.autoAccept;
  var username = bot.users[steamID].playerName || '';
  var isAdmin = (config.admins.indexOf(steamID) > -1) ? true : false;

  // Friend request received
  if (status === 2 && autoAcceptEnabled) {

    console.log('Added friend: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

  // A friend removed the bot :(
  else if (status === 0) {

    console.log('Friend removed: %s (%s)', username, steamID);

  }

  // An admin sent a friend request
  else if (status === 2 && isAdmin) {

    console.log('Added admin: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

};