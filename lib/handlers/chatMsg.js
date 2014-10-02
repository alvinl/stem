
module.exports = function (groupID, message, messageType, userID) {

  var Stem       = this,
      isAdmin    = this.api.isAdmin(userID),
      playerName = ((this.bot.users[userID]) ? this.bot.users[userID].playerName : userID);

  // Only listen for `ChatMsg` types
  if (messageType !== 1)
    return;

  Stem.log.info((isAdmin ? '[Admin] ' : '') + playerName + ': ' + message);

  /**
   * Details about the matched command
   * @type {Object}
   */
  var matchedCommand = Stem.api._matchCommand(message, 'group', isAdmin);

  if (matchedCommand)
    return matchedCommand.handler.call(Stem, userID, { match: matchedCommand.listener.exec(message) }, groupID);

};
