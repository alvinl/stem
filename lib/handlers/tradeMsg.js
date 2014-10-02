
module.exports = function (message) {

  var Stem       = this,
      log        = this.log,
      steamID    = this.trade.client,
      isAdmin    = this.api.isAdmin(steamID),
      playerName = ((this.bot.users[steamID]) ? this.bot.users[steamID].playerName : steamID);

  log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + message);

  /**
   * Details about the matched command
   * @type {Object}
   */
  var matchedCommand = Stem.api._matchCommand(message, 'trade', isAdmin);

  if (matchedCommand)
    return matchedCommand.handler.call(Stem, steamID, { match: matchedCommand.listener.exec(message) });

};
