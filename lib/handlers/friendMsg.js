
module.exports = function (steamID, rawMessage, messageType) {
  
  var log        = this.log,
      isAdmin    = this.utils.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  // Ignore `is typing` messages
  if (messageType === 2) return;

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + rawMessage);

};