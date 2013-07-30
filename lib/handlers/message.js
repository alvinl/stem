
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
    if (cmd === 'items' && app.tradeReady) {

      itemsAmount(steamID);

    // Command: items list
    } else if (cmd === 'items list' && app.tradeReady) {

      itemsList(steamID);

    // Command: items metal
    } else if (cmd === 'items metal' && app.tradeReady) {

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

      app.Message(steamID, '\n   Bot commands:' +
                            '\n - items (gives amount items in bp)' +
                            '\n - items list (list\'s all items in bp)' +
                            '\n - items metal (give amount of metal in bp)' +
                            '\n - add friend 1234 (sends a friend request to the user64 bit id provdided)' +
                            '\n - remove friend 123 (replace 123 with 64bit user id)' +
                            '\n - idle on (idles the games in your config)' +
                            '\n - idle off (stops idling current games)' +
                            '\n - log off (makes the bot log off)');

    } else if (cmd === 'idle off') {
      idleOff();
    } else if (cmd === 'idle on') {
      idleOn();
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