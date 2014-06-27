
module.exports = function (steamID, rawMessage, messageType) {

  // Ignore `is typing` messages
  if (messageType === 2) return;
  
  var Stem       = this,
      log        = this.log,
      isAdmin    = this.api.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  var matchedAdminCommands = Object.keys(Stem.commands.admin).length ? Object.keys(Stem.commands.admin).filter(function (adminCommand) {
    
    if (rawMessage.lastIndexOf(adminCommand, 0) === 0)
      return adminCommand;

  }) : [];

  var matchedNormalCommands = Object.keys(Stem.commands.normal).length ? Object.keys(Stem.commands.normal).filter(function (normalCommand) {
    
    if (rawMessage.lastIndexOf(normalCommand, 0) === 0)
      return normalCommand;

  }) : [];

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + rawMessage);

  // Admin commands
  if (isAdmin && matchedAdminCommands.length)
    return Stem.commands.admin[matchedAdminCommands[0]].call(Stem, steamID, rawMessage
                                                                            .replace(matchedAdminCommands[0], '')
                                                                            .split(' ')
                                                                            .slice(1));
  
  // Normal commands
  else if (isAdmin && matchedNormalCommands.length || matchedNormalCommands.length)
    return Stem.commands.normal[matchedNormalCommands[0]].call(Stem, steamID, rawMessage
                                                                              .replace(matchedNormalCommands[0], '')
                                                                              .split(' ')
                                                                              .slice(1));

};
