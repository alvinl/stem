
module.exports = function() {
  
  var bot = this;
  var config = bot.config;

  // Accept offline requests if enabled
  if (config.autoAcceptOffline) {

    for (var friend in bot.friends) {
      if (bot.friends[friend] === 2) {
        bot.addFriend(friend);
        console.log('Added friend: %s', friend);
      }
    }

  }

};