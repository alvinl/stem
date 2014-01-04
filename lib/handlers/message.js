
module.exports = function(steamID, rawMessage, messageType) {
  
  var bot = this;
  var config = bot.config;
  var Cmd = require('./commands')(bot);
  var message = rawMessage.toLowerCase();
  var username = bot.users[steamID].playerName;
  var commands = rawMessage.toLowerCase().split(' ');
  var isAdmin = (messageType === 1 && config.admins.indexOf(steamID) > -1);

  // Handle admin commands
  if (isAdmin) {

    console.log('Admin message: %s', message);

    // Command: help
    if (message === 'help') {

      Cmd.help(steamID);

    }

    // Command: version
    else if (message === 'version') {

      Cmd.sendVersion(steamID, config.version);

    }

    // Command: log off
    else if (message === 'log off') {

      Cmd.logOff();

    }

    // Command: add friend <steamID>
    else if (commands[0] === 'add' && commands[1] === 'friend') {

      var friendToAdd = commands[2];

      Cmd.addFriend(friendToAdd);

    }

    // Command: remove friend <steamID>
    else if (commands[0] === 'remove' && commands[1] === 'friend') {

      var friendToRemove = commands[2];

      Cmd.removeFriend(friendToRemove);

    }

    // Command: idle on
    else if (message === 'idle on') {

      Cmd.idleOn();

    }

    // Command: idle off
    else if (message === 'idle off') {

      Cmd.idleOff();

    }

    // Command: set status <status>
    else if (commands[0] === 'set' && commands[1] === 'status') {

      var botStatus = commands[2];

      Cmd.setStatus(botStatus);

    }

    // Command: set botname "<botname>"
    else if (commands[0] === 'set' && commands[1] === 'botname') {

      var botName = rawMessage.split('"');

      Cmd.setBotname(botName);

    }

    // Command: enable autoaccept
    else if (commands[0] === 'enable' && commands[1] === 'autoaccept') {

      Cmd.autoAcceptStatus('enable');

    }

    // Command: disable autoaccept
    else if (commands[0] === 'disable' && commands[1] === 'autoaccept') {

      Cmd.autoAcceptStatus('disable');

    }

  }

  // Log everything else
  else if (message) {

    console.log('Message: %s', message);

  }

  // Custom replies
  if (message in config.messages) {

    bot.sendMessage(steamID, config.messages[message], 1);

  }

};