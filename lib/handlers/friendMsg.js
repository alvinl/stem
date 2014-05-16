
module.exports = function (steamID, rawMessage, messageType) {
  
  var log     = this.log,
      isAdmin = this.utils.isAdmin(steamID);

  // Ignore `is typing` messages
  if (messageType === 2) return;

  log.info((isAdmin ? '[Admin] ' : '') + this.bot.users[steamID].playerName + ': ' + rawMessage);

};