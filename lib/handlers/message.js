
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

  // Make admin commands to lower case
  var cmd = message.toLowerCase();

  // Admin commands
  if (message && config.admins.indexOf(steamID) > -1) {


    // Command: items
    if (cmd === 'items' && app.tradeReady) {

      app.botTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        app.Message(steamID, 'I currently have ' + invTradable.length + ' items in my inventory.');
      });

    // Command: items list
    } else if (cmd === 'items list' && app.tradeReady) {

      app.botTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        invTradable.forEach(function(item) {
          app.Message(steamID, item.name);
        });
      });

    // Command: items metal
    } else if (cmd === 'items metal' && app.tradeReady) {

      app.botTrade.loadInventory(440, 2, function(inv) {
        var invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal'; }).length;
        var invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal'; }).length;
        var invRef = inv.filter(function(item) { return item.name === 'Refined Metal'; }).length;
        app.Message(steamID, 'Scrap: ' + invScrap + ' Reclaimed: ' + invRec + ' Refined: ' + invRef);
      });

    // Command: add friend
    } else if (cmdArr[0] === 'add' && cmdArr[1] === 'friend') {

      app.bot.addFriend(cmdArr[2]);
      app.Message(steamID, 'Friend request sent.');
      log.info('Sending friend request to: ' + cmdArr[2]);

    // Command: remove friend
    } else if (cmdArr[0] === 'remove' && cmdArr[1] === 'friend') {

      app.bot.removeFriend(cmdArr[2]);
      log.info('Removing friend: ' + cmdArr[2]);
      app.Message(steamID, 'Removed friend.');

    // Command: log off
    } else if (cmd === 'log off') {

      log.warn('Bot logging off');
      app.bot.logOff();

    // Command: help
    } else if (cmd === 'help') {

      app.Message(steamID, 'Bot commands:\n - items (gives amount items in bp)\n - items list (list\'s all items in bp)\n - items metal (give amount of metal in bp)\n - add friend 1234 (sends a friend request to the user64 bit id provdided)\n - remove friend 123 (replace 123 with 64bit user id)\n - log off (makes the bot log off)');

    }

  } 

  // Log messages
  if (message) {
    log.warn(steamID + ': ' + message);
  }

};