
module.exports = function (steamID, message, messageType) {

  var Stem       = this,
      log        = this.log,
      isAdmin    = this.api.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  // Only listen for `ChatMsg` types
  if (messageType !== 1)
    return;

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + message);

  /**
   * Details about the matched command
   * @type {Object}
   */
  var matchedCommand = Stem.api._matchCommand(message, 'message', isAdmin);

  if (matchedCommand)
    return matchedCommand.handler.call(Stem, steamID, { match: matchedCommand.listener.exec(message) });

};
