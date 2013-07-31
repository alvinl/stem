
/*
 * 
 * message handler
 *
 * - Description - 
 * Handles the event for when the bot receives a new
 * message
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Message event
module.exports = function(steamID, message, type){

  // Put words into array for conv.
  var cmdArr = message.split(' ');

  var cmd = message.toLowerCase();

  // Admin commands
  if (message && config.admins.indexOf(steamID) > -1) {


    // Command: items
    if (cmd === 'items' && app.webReady) {

      itemsAmount(steamID);

    // Command: items list
    } else if (cmd === 'items list' && app.webReady) {

      itemsList(steamID);

    // Command: items metal
    } else if (cmd === 'items metal' && app.webReady) {

      itemsMetal(steamID);

    // Command: add friend
    } else if (cmdArr[0] === 'add' && cmdArr[1] === 'friend') {

      addFriend(steamID, cmdArr);

    // Command: remove friend
    } else if (cmdArr[0] === 'remove' && cmdArr[1] === 'friend') {

      removeFriend(steamID, cmdArr);

    // Command: log off
    } else if (cmd === 'log off') {

      logOff();

    // Command: help
    } else if (cmd === 'help') {

      app.Message(steamID,  '\n - items (gives amount items in bp)' +
                            '\n - items list (list\'s all items in bp)' +
                            '\n - items metal (give amount of metal in bp)' +
                            '\n - remove/add friend 123 (replace 123 the users 64bit id)' +
                            '\n - idle on/off (disables/enables idling games)' +
                            '\n - set status (online, busy, tradeready, away, snooze, playready)' +
                            '\n - set botname "BotName" (the name must be in parentheses)' +
                            '\n - enable/disable trade (disables or enables bot trading)' +
                            '\n - log off (makes the bot log off)');

    // Command: idle off
    } else if (cmd === 'idle off') {

      idleOff();

    // Command: idle on
    } else if (cmd === 'idle on') {

      idleOn();

    // Command: set status
    } else if (cmdArr[0] === 'set' && cmdArr[1] === 'status') {

      setStatus(cmdArr, steamID);

    // Command: set botname
    } else if (cmdArr[0] === 'set' && cmdArr[1] === 'botname') {

      setBotname(message, cmdArr);

    // Command: enable / disable trade
    } else if (cmdArr[0] === 'enable' || cmdArr[0] === 'disable' && cmdArr[1] === 'trade') {

      tradeStatus(cmdArr[0]);

    }

  } 

  // Log messages
  if (message) {
    log.warn(steamID + ': ' + message);
  }

};


// Display amount of items
function itemsAmount(steamID) {
  app.botTrade.loadInventory(440, 2, function(inv) {
    var invTradable = inv.filter(function(item) { return item.tradable; });
    app.Message(steamID, 'I currently have ' + invTradable.length + ' items in my inventory.');
  });
}


// List items
function itemsList(steamID) {
  app.botTrade.loadInventory(440, 2, function(inv) {
    var invTradable = inv.filter(function(item) { return item.tradable; });
    invTradable.forEach(function(item) {
      app.Message(steamID, item.name);
    });
  });
}


// Send amount of metal
function itemsMetal(steamID) {
  app.botTrade.loadInventory(440, 2, function(inv) {
    var invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal'; }).length;
    var invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal'; }).length;
    var invRef = inv.filter(function(item) { return item.name === 'Refined Metal'; }).length;
    app.Message(steamID, 'Scrap: ' + invScrap + ' Reclaimed: ' + invRec + ' Refined: ' + invRef);
  });
}


// Add friend
function addFriend(steamID, cmdArr) {
  app.bot.addFriend(cmdArr[2]);
  app.Message(steamID, 'Friend request sent.');
  log.info('Sending friend request to: ' + cmdArr[2]);
}


// Remove friend
function removeFriend(steamID, cmdArr) {
  app.bot.removeFriend(cmdArr[2]);
  log.info('Removing friend: ' + cmdArr[2]);
  app.Message(steamID, 'Removed friend.');
}


// Log off
function logOff() {
  log.warn('Bot logging off');
  app.bot.logOff();
}


// Turn Idling off
function idleOff() {
  app.bot.gamesPlayed([]);
}


// Turn idling on
function idleOn() {
  app.bot.gamesPlayed(config.idleGames);
}


// Set status
function setStatus(cmdArr, steamID) {
  if (cmdArr[2] === 'tradeready') {
    app.bot.setPersonaState(app.Steam.EPersonaState.LookingToTrade);
  } else if (cmdArr[2] === 'online') {
    app.bot.setPersonaState(app.Steam.EPersonaState.Online);
  } else if (cmdArr[2] === 'busy') {
    app.bot.setPersonaState(app.Steam.EPersonaState.Busy);
  } else if (cmdArr[2] === 'away') {
    app.bot.setPersonaState(app.Steam.EPersonaState.Away);
  } else if (cmdArr[2] === 'snooze') {
    app.bot.setPersonaState(app.Steam.EPersonaState.Snooze);
  } else if (cmdArr[2] === 'playready') {
    app.bot.setPersonaState(app.Steam.EPersonaState.LookingToPlay);
  } else {
    app.Message(steamID, 'Not a valid status');
  }
}


// Set botname
function setBotname(message, cmdArr) {
  var botName = message.split('"');
  // <3
  if (botName[1] === '' || botName[1] === ' ') {
    app.bot.setPersonaName('R2D2');
  } else {
    app.bot.setPersonaName(botName[1]);
  }
}

// Enable / Disable trade
function tradeStatus(status) {
  if (status === 'enable') {
    app.tradeReady = true;
  } else if (status === 'disable') {
    app.tradeReady = false;
  }
}
