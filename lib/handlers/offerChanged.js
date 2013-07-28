
/*
 * 
 * offerChanged handler
 *
 * - Description - 
 * Handles the event for when a new item has been
 * added or removed in a trade.
 * 
 */


// Import modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Offer changed event
module.exports = function(change, item){

  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Add / remove items into a seperate inventory to validate later
  if (change) {
    app.clientInv.push(item);
  } else if (!change) {
    app.clientInv.pop();
  }

  // Scrapbank
  if (config.scrapbank) {
    if (item.tags && item.tags.some(function(tag) {
      return ~['primary', 'secondary', 'melee', 'pda2'].indexOf(tag.internal_name);
    }) && (item.descriptions === '' || !item.descriptions.some(function(desc) {
      return desc.value === '( Not Usable in Crafting )';
    }))) {
      // this is a craftable weapon
      app.weapons += change ? 1 : -1;
      if (app.addedScrap.length !== Math.floor(app.weapons / 2)) {
        // need to change number of scrap
        if (change && app.scrap.length > app.addedScrap.length) {
          log.warn('Adding scrap');
          var newScrap = app.scrap[app.addedScrap.length];
          app.botTrade.addItems([newScrap]);
          app.addedScrap.push(newScrap);
        } else if (!change && app.addedScrap.length > Math.floor(app.weapons / 2)) {
          log.warn('Removing scrap');
          var scrapToRemove = app.addedScrap.pop();
          app.botTrade.removeItem(scrapToRemove);
        }
      }
    }
  }

};