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
  , tradeReady = false;


// Servers event
exports.servers = function(servers){
  fs.writeFile('servers.json', JSON.stringify(servers));
};


// Sentry event
exports.sentry = function(hash){
  fs.writeFile(config.username + '.hash', hash, function(err) {
    log.warn('Sentry saved!');
  });
};


// Error event
exports.error = function(e){
  if (config.debug) {
    log.warn(e);
  }
  if (e.eresult === 65) {
    app.bot.logOn(config.username, config.password);
    log.warn('Enter Steamcode below');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      var code = data.replace('\n', '');
      app.bot.logOn(config.username, config.password, code);
    });
  } else if (e.eresult === 5) {
    log.error('Invalid password, please check that the password in your config is correct');
  }
};


// Message event
exports.message = function(steamID, message, type){
  if (message && config.admins.indexOf(steamID) > -1) {
    if (message === 'items' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        app.bot.sendMessage(steamID, 'I currently have ' + invTradable.length + ' items in my inventory.', app.steam.EChatEntryType.ChatMsg);
      });
    } else if (message === 'items list' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invTradable = inv.filter(function(item) { return item.tradable; });
        invTradable.forEach(function(item) {
          app.bot.sendMessage(steamID, item.name, app.steam.EChatEntryType.ChatMsg);
        });
      });
    } else if (message === 'items metal' && tradeReady) {
      app.steamTrade.loadInventory(440, 2, function(inv) {
        var invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal'; });
        var invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal'; });
        var invRef = inv.filter(function(item) { return item.name === 'Refined Metal'; });
        app.bot.sendMessage(steamID, 'Scrap: ' + invScrap.length + ' Reclaimed: ' + invRec.length + ' Refined: ' + invRef.length, app.steam.EChatEntryType.ChatMsg);
      });
    } else if (message === 'help') {
      app.bot.sendMessage(steamID, 'Bot commands:\n - items (gives amount items in bp) \n - items list (list\'s all items in bp) \n - items metal (give amount of metal in bp)', app.steam.EChatEntryType.ChatMsg);
    }
  } else if (message) {
    log.warn(steamID + ': ' + message);
  }
};


// Logged In event
exports.loggedOn = function(){
  log.info('Bot logged in');

  app.bot.setPersonaState(app.steam.EPersonaState.Online);

  if (config.botname) {
    log.info('Changing botname to: ' + config.botname);
    app.bot.setPersonaName(config.botname);
  }

  if (config.tradeWhitelist.enabled) {
    log.info('Trade whitelist is enabled');
  }

  if (config.idle) {
    log.info('Idling: ' + config.idleGames);
    app.bot.gamesPlayed(config.idleGames);
  }
};


// Web Session event
exports.webSession = function(sessionID){
  app.steamTrade.sessionID = sessionID;
  app.bot.webLogOn(function(cookies) {
    cookies.split(';').forEach(function(cookie) {
      app.steamTrade.setCookie(cookie);
    });
    log.info('Ready to trade');
    if (config.scrapbank) {
      log.info('Scrapbanking enabled');
    }
    tradeReady = true;
  });
};


/*
 * Trade related handlers
*/


// Trade proposed event
exports.tradeProposed = function(tradeID, otherClient){
  if (!tradeReady) {
    app.bot.respondToTrade(tradeID, false);
    log.warn('Denying trade request from ' + otherClient + ', not ready to trade');
  } else {
    log.warn('Trade has been proposed by: %s (%s)', app.bot.users[otherClient].playerName, otherClient);
    if (config.tradeWhitelist) {
      if (config.tradeWhitelist.whitelist.indexOf(otherClient) > -1) {
        app.bot.respondToTrade(tradeID, true);
        log.info('Accepted trade request');
      } else {
        if (config.tradeWhitelist.denyMessage) {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
          app.bot.sendMessage(otherClient, config.tradeWhitelist.denyMessage, app.steam.EChatEntryType.ChatMsg);
        } else {
          app.bot.respondToTrade(tradeID, false);
          log.info('Denied trade request');
        }
      }
    } else {
      app.bot.respondToTrade(tradeID, true);
      log.info('Accepted trade request');
    }
  }
};


// Session start event (trade window opens up)
exports.sessionStart = function(otherClient){
  inventory = [];
  scrap = [];
  weapons = 0;
  addedScrap = [];
  clientInv = [];
  client = otherClient;

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
  log.info('Readying up...');
  if (Validate(clientInv, app.steamTrade.themAssets)) {
    log.warn('Confirming');
    app.steamTrade.ready(function(){
      app.steamTrade.confirm();
    });
  } else {
    log.error("Items in trade do not match, cancelling trade");
    app.steamTrade.cancel();
  }
};


// End event
exports.end = function(status, getItems){
  log.warn('Trade: ' + status);
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