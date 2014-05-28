
module.exports = function (steamID, rawMessage, messageType) {
  
  var Stem       = this,
      log        = this.log,
      command    = rawMessage.toLowerCase(),
      isAdmin    = this.api.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  // Ignore `is typing` messages
  if (messageType === 2) return;

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + rawMessage);

  // Check registered admin commands
  if (isAdmin && Object.keys(Stem.commands.admin).length && Stem.commands.admin[command])
    return Stem.commands.admin[command].call(Stem, steamID);

  // Check normal registered commands
  else if (Object.keys(Stem.commands.normal).length && Stem.commands.normal[command])
    return Stem.commands.normal[command].call(Stem, steamID);

};
