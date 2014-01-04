
module.exports = function (bot) {

  return new Cmd(bot);

};

function Cmd(bot) {

  this.bot = bot;

}

Cmd.prototype.help = function(steamID) {

  var bot = this.bot;

  bot.sendMessage(steamID, '\n - items (gives amount items in bp)' +
                           '\n - items list (list\'s all items in bp)' +
                           '\n - items metal (give amount of metal in bp)' +
                           '\n - remove/add friend 123 (replace 123 the users 64bit id)' +
                           '\n - idle on/off (disables/enables idling games)' +
                           '\n - set status (online, busy, tradeready, away, snooze, playready)' +
                           '\n - set botname "BotName" (the name must be in parentheses)' +
                           '\n - enable/disable trade (disables or enables bot trading)' +
                           '\n - version (display\'s the bot\'s version)' +
                           '\n - log off (makes the bot log off)', 1);

};

Cmd.prototype.sendVersion = function(steamID, version) {

  var bot = this.bot;

  bot.sendMessage(steamID, version, 1);

};

Cmd.prototype.addFriend = function(friend) {

  var bot = this.bot;

  bot.addFriend(friend);

};

Cmd.prototype.removeFriend = function(friend) {

  var bot = this.bot;

  bot.removeFriend(friend);

};

Cmd.prototype.logOff = function() {

  var bot = this.bot;

  console.log('Bot logging off');
  bot.logOff();

};

Cmd.prototype.idleOn = function() {

  var bot = this.bot;

  bot.gamesPlayed(bot.config.idleGames);

};

Cmd.prototype.idleOff = function() {

  var bot = this.bot;

  bot.gamesPlayed([]);

};

Cmd.prototype.setStatus = function(status) {

  var bot = this.bot;

  switch(status)
  {

    case 'online':
      bot.setPersonaState(1);
      break;

    case 'busy':
      bot.setPersonaState(2);
      break;

    case 'away':
      bot.setPersonaState(3);
      break;

    case 'snooze':
      bot.setPersonaState(4);
      break;

    case 'tradeready':
      bot.setPersonaState(5);
      break;

    case 'playready':
      bot.setPersonaState(6);
      break;

  }

};

Cmd.prototype.setBotname = function(botName) {

  var bot = this.bot;

  // Botname is empty
  if (botName[1] === '' || botName[1] === ' ') {

    bot.setPersonaName('R2D2');
    return;

  }

  bot.setPersonaName(botName[1]);

};

Cmd.prototype.autoAcceptStatus = function(status) {

  if (status === 'enable') {

    bot.config.autoAccept = true;

  }

  else if (status === 'disable') {

    bot.config.autoAccept = false;

  }

};
