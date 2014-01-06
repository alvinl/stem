
module.exports = function() {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;

  // Accept offline requests if enabled
  if (config.autoAcceptOffline) {

    for (var friend in bot.friends) {
      if (bot.friends[friend] === 2) {
        bot.addFriend(friend);
        log.info('Added friend: %s', friend);
      }
    }

  }

};