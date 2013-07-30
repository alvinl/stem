
/*
 * 
 * chatMsg handler
 *
 * - Description - 
 * Handles the event for when the bot receives a
 * new message in the trade window
 *
 */


// Import Modules
var app = require('./../../app')
  , log = require('./../logger.js')
  , config = require('./../../config.json');


// chatMsg event
module.exports = function(msg) {
  
  // Check if client is an admin
  if (config.admins.indexOf(app.client) > -1) {
    // Give all items in the bot's inventory
    if (msg === 'give all') {
      GiveAll();
    } else if (msg === 'give scrap') {
      GiveScrap();
    } else if (msg === 'give reclaimed' || msg === 'give rec') {
      GiveReclaimed();
    } else if (msg === 'give refined' || msg === 'give ref') {
      GiveRefined();
    }

  }

  log.warn('Trade message: ' + msg);

};

function GiveAll() {
  var invTradable = app.inventory.filter(function(item) { return item.tradable; });
  app.botTrade.addItems(invTradable);
}

function GiveScrap() {
  var invScrap = app.inventory.filter(function(item) { return item.name === 'Scrap Metal'; });
  if (invScrap.length > 0) {
    app.botTrade.addItems(invScrap);
  } else {
    app.botTrade.chatMsg('I don\'t have any scrap.');
  }
}

function GiveReclaimed() {
  var invReclaimed = app.inventory.filter(function(item) { return item.name === 'Reclaimed Metal'; });
  if (invReclaimed.length > 0) {
    app.botTrade.addItems(invReclaimed);
  } else {
    app.botTrade.chatMsg('I don\'t have any reclaimed.');
  }
}

function GiveRefined() {
  var invRefined = app.inventory.filter(function(item) { return item.name === 'Refined Metal'; });
  if (invRefined.length > 0) {
    app.botTrade.addItems(invRefined);
  } else {
    app.botTrade.chatMsg('I don\'t have any refined.');
  }
}