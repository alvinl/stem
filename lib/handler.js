// Load Modules

var fs = require('fs')
  , config = require('./../config.json')
  , log = require('./logger.js').log
  , app = require('./../app.js');

var inventory
  , scrap
  , weapons
  , addedScrap
  , client
  , clientInv = []
  , tradeReady = false
  , tradeTimer;


// Servers event
exports.servers = function(servers){

  // Write the servers to servers.json
  fs.writeFile('servers.json', JSON.stringify(servers));

};


// Sentry event
exports.sentry = function(hash){

  // Save sentry to botusername.hash
  fs.writeFile(config.username + '.hash', hash, function(err) {
    if (!err) {
      log.warn('Sentry saved!');
    // Error saving sentry
    } else {
      log.error('Failed to save sentry %s', err);
    }
  });

};


// Friendship event
exports.friendship = function(steamID, status){

  // Friend request
  if (status === 2 && config.autoAccept) {
    log.info('New friend: ' + steamID);
    // Accept friend request
    app.bot.addFriend(steamID);
  // Friend removed bot
  } else if (status === 0) {
    log.info('Friend removed: ' + steamID);
  }

};


// Error event
exports.error = function(e){

  // Log all errors if debug is on
  if (config.debug) {
    log.warn(e);
  }

  // Sentry is invalid, try sending email auth code
  if (e.eresult === 65) {
    // Login with standard username + password to send email code
    app.bot.logOn(config.username, config.password);
    log.warn('Enter Steamcode below');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      var code = data.replace('\n', '');
      app.bot.logOn(config.username, config.password, code);
    });
  // Password is just plain wrong
  } else if (e.eresult === 5) {
    log.error('Invalid password, please check that the password in your config is correct');
  }

};


// Message event
exports.message = function(steamID, message, type){

  // Put words into array for conv.
  var command = message.split(' ');

  // Admin commands
  if (message && config.admins.indexOf(steamID) > -1) {

    // Command: items
    if (message === 'items' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        Message(steamID, 'I currently have ' + invTradable.length + ' items in my inventory.');
      });
    // Command: items list
    } else if (message === 'items list' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        invTradable.forEach(function(item) {
          Message(steamID, item.name);
        });
      });
    // Command: items metal
    } else if (message === 'items metal' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal'; }).length;
        var invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal'; }).length;
        var invRef = inv.filter(function(item) { return item.name === 'Refined Metal'; }).length;
        Message(steamID, 'Scrap: ' + invScrap + ' Reclaimed: ' + invRec + ' Refined: ' + invRef);
      });
    // Command: add friend
    } else if (command[0] === 'add' && command[1] === 'friend') {
      app.bot.addFriend(command[2]);
      Message(steamID, 'Friend request sent.');
      log.info('Sending friend request to: ' + command[2]);
    // Command: remove friend
    } else if (command[0] === 'remove' && command[1] === 'friend') {
      app.bot.removeFriend(command[2]);
      log.info('Removing friend: ' + command[2]);
      Message(steamID, 'Removed friend.');
    // Command: help
    } else if (message === 'help') {
      Message(steamID, 'Bot commands:\n - items (gives amount items in bp)\n - items list (list\'s all items in bp)\n - items metal (give amount of metal in bp)\n - add friend 1234 (sends a friend request to the user64 bit id provdided)\n - remove friend 123 (replace 123 with 64bit user id)');
    }

  } 

  // Log all other messages
  if (message) {
    log.warn(steamID + ': ' + message);
  }

};


// Logged In event
exports.loggedOn = function(){

  // Log successful login 
  log.info('Bot logged in');

  // Set bot status to "Online"
  app.bot.setPersonaState(app.steam.EPersonaState.Online);

  // Check for botname in config
  if (config.botname) {
    log.info('Changing botname to: ' + config.botname);
    // Change bot's username
    app.bot.setPersonaName(config.botname);
  }

  // Notify user if whitelist is enabled
  if (config.tradeWhitelist.enabled) {
    log.info('Trade whitelist is enabled');
  }

  // Check if idling is enabled
  if (config.idle) {
    log.info('Idling: ' + config.idleGames);
    // Idle games in config
    app.bot.gamesPlayed(config.idleGames);
  }

};


// Web Session event
exports.webSession = function(sessionID){

  // Set the sessionID to use steamTrade
  app.steamTrade.sessionID = sessionID;

  // Log in to get cookies
  app.bot.webLogOn(function(cookies) {
    cookies.split(';').forEach(function(cookie) {
      // Set cookies to use steam trade
      app.steamTrade.setCookie(cookie);
    });
    log.info('Ready to trade');
    // Notify user if scrapbank is enabled
    if (config.scrapbank) {
      log.info('Scrapbanking enabled');
    }
    // This is needed to avoid conflicts
    tradeReady = true;
  });

};


/*
 * Trade related handlers
*/


// Trade proposed event
exports.tradeProposed = function(tradeID, otherClient){

  // If the bot hasn't logged in, deny all trade requests
  if (!tradeReady) {
    app.bot.respondToTrade(tradeID, false);
    log.warn('Denying trade request from ' + otherClient + ', not ready to trade');
  // Bot has logged in and can trade
  } else {
    // Notify that a new trade has been proposed
    log.warn('Trade has been proposed by: %s (%s)', app.bot.users[otherClient].playerName, otherClient);
    // Check if whitelist is on
    if (config.tradeWhitelist) {
      // Check if user is on the whitelist
      if (config.tradeWhitelist.whitelist.indexOf(otherClient) > -1) {
        app.bot.respondToTrade(tradeID, true);
        log.info('Accepted trade request');
      // User is not on the whitelist
      } else {
        // Check if there's a custom deny message
        if (config.tradeWhitelist.denyMessage) {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
          Message(otherClient, config.tradeWhitelist.denyMessage);
        // If there's no custom deny message just deny the request
        } else {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
        }
      }
    // If whitelist isn't on just accept all trade requests
    } else {
      app.bot.respondToTrade(tradeID, true);
      log.info('Accepted trade request');
    }
  }

};


// Session start event (trade window opens up)
exports.sessionStart = function(otherClient){

  // Reset invs
  inventory = [];
  scrap = [];
  weapons = 0;
  addedScrap = [];
  clientInv = [];
  client = otherClient;

  // Clear previous timers
  clearTimeout(tradeTimer);

  // Start trade timer
  if (config.timeout && !config.admins.indexOf(otherClient) > -1) {
    tradeTimer = setTimeout(function() {
      app.steamTrade.cancel(function() {
        log.warn('Client took too long, cancelling trade');
      });
    },config.timeout * 1000);
  }

  log.warn('Started trading %s (%s)', app.bot.users[client].playerName, client);
  app.steamTrade.open(otherClient);
  app.steamTrade.loadInventory(440, 2, function(inv) {
    inventory = inv;
    scrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
    // app.steamTrade.chatMsg('Hello there!');
  });

};


// Offer change in trade window
exports.offerChanged = function(change, item){

  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Add / remove items into a seperate inventory to validate
  if (change) {
    clientInv.push(item);
  } else if (!change) {
    clientInv.pop();
  }

  // Scrapbank
  if (config.scrapbank) {
    if (item.tags && item.tags.some(function(tag) {
      return ~['primary', 'secondary', 'melee', 'pda2'].indexOf(tag.internal_name);
    }) && (item.descriptions === '' || !item.descriptions.some(function(desc) {
      return desc.value === '( Not Usable in Crafting )';
    }))) {
      // this is a craftable weapon
      weapons += change ? 1 : -1;
      if (addedScrap.length !== Math.floor(weapons / 2)) {
        // need to change number of scrap
        if (change && scrap.length > addedScrap.length) {
          log.warn('Adding scrap');
          var newScrap = scrap[addedScrap.length];
          app.steamTrade.addItems([newScrap]);
          addedScrap.push(newScrap);
        } else if (!change && addedScrap.length > Math.floor(weapons / 2)) {
          log.warn('Removing scrap');
          var scrapToRemove = addedScrap.pop();
          app.steamTrade.removeItem(scrapToRemove);
        }
      }
    }
  }

};


// Ready event
exports.ready = function(){
  log.info('Validating items');

  // Validate items in trade
  if (Validate(clientInv, app.steamTrade.themAssets)) {
    log.info('Confirming');
    app.steamTrade.ready(function(){
      app.steamTrade.confirm();
    });
  // Items are not valid
  } else {
    log.error("Items in trade do not match, cancelling trade");
    app.steamTrade.cancel();
  }

};


// End event
exports.end = function(status, getItems){

  // Clear the trade timer
  clearTimeout(tradeTimer);

  // Log items received
  if (status === 'complete') {
    getItems(function(items){
      log.warn('Trade completed');
      items.forEach(function(item) {
        log.warn('Received: ' + item.name);
      });
    });
  // Log other trade status's
  } else {
    log.warn('Trade: ' + status);
  }

};


/*
 * General functions
*/


// Validate arrays
function Validate(arr1, arr2){
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}


// Send message
function Message(to, message){
  app.bot.sendMessage(to, message, app.steam.EChatEntryType.ChatMsg);
}