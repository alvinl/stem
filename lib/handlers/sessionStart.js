
/*
 * 
 * sessionStart handler
 *
 * - Description - 
 * Handles the event for when a trade session has started
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Session start event
module.exports = function(otherClient){

  // Reset invs
  app.inventory = [];
  app.scrap = [];
  app.weapons = 0;
  app.addedScrap = [];
  app.clientInv = [];
  app.client = otherClient;

  // Clear previous timers
  clearTimeout(app.tradeTimer);

  // Start trade timer
  if (config.timeout && config.admins.indexOf(otherClient) === -1) {
    app.tradeTimer = setTimeout(function() {
      app.botTrade.cancel(function() {
        log.warn('Client took too long, cancelling trade');
      });
    },config.timeout * 1000);
  }

  log.warn('Started trading %s (%s)', app.bot.users[app.client].playerName, app.client);
  app.botTrade.open(otherClient);
  app.botTrade.loadInventory(440, 2, function(inv) {
    app.inventory = inv;
    app.scrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
    if (config.trade.welcomeMsg) {
      var invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal'; }).length;
      var invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal'; }).length;
      var invRef = inv.filter(function(item) { return item.name === 'Refined Metal'; }).length;
      var invTradable = inv.filter(function(item) { return item.tradable; }).length;
      app.botTrade.chatMsg(config.trade.welcomeMsg
        .replace('%scrap', invScrap)
        .replace('%reclaimed', invRec)
        .replace('%refined', invRef)
        .replace('%items', invTradable));
    }
  });

};