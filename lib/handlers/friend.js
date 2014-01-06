
module.exports = function(steamID, status) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var autoAcceptEnabled = config.autoAccept;
  var username = bot.users[steamID].playerName;
  var isAdmin = (config.admins.indexOf(steamID) > -1) ? true : false;

  if (status === 2 && isAdmin) {

    log.info('Added admin: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

  // Friend request received
  else if (status === 2 && autoAcceptEnabled) {

    log.info('Added friend: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

  // A friend removed the bot :(
  else if (status === 0) {

    log.info('Friend removed: %s (%s)', username, steamID);

  }

};