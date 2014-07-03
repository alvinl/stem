
module.exports = function (message) {
  
  var Stem       = this,
      log        = this.log,
      steamID    = this.trade.client,
      isAdmin    = this.api.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  var matchedAdminCommands = Object.keys(Stem.tradeCommands.admin).length ? Object.keys(Stem.tradeCommands.admin).filter(function (adminCommand) {
    
    if (message.lastIndexOf(adminCommand, 0) === 0) {

      return adminCommand;

    }

  }) : [];

  var matchedNormalCommands = Object.keys(Stem.tradeCommands.normal).length ? Object.keys(Stem.tradeCommands.normal).filter(function (normalCommand) {
    
    if (message.lastIndexOf(normalCommand, 0) === 0) {

      return normalCommand;

    }

  }) : [];

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + message);

  // Admin trade commands
  if (isAdmin && matchedAdminCommands.length) {

    return Stem.tradeCommands.admin[matchedAdminCommands[0]].call(Stem, steamID, message
                                                                                  .replace(matchedAdminCommands[0], '')
                                                                                  .split(' ')
                                                                                  .slice(1));

  }
  
  // Normal trade commands
  else if (isAdmin && matchedNormalCommands.length || matchedNormalCommands.length) {

    return Stem.tradeCommands.normal[matchedNormalCommands[0]].call(Stem, steamID, message
                                                                                    .replace(matchedNormalCommands[0], '')
                                                                                    .split(' ')
                                                                                    .slice(1));

  }

};