
/**
 * A module to handle inventories
 *
 * @module Inventory
 */

/**
 * Export `Inventory`
 */

module.exports = Inventory;

/**
 * Creates a new `Inventory` instance
 * @class
 */
function Inventory (stem) {

  this.stem = stem;
  this.data = {};

}

/**
 * Loads and caches the specified inventory
 *
 * @param  {String}   appID
 * @param  {String}   contextID
 * @param  {Function} cb
 */
Inventory.prototype.load = function(appID, contextID, cb) {

  var self = this,
      stem = this.stem;

  stem.botOffers.loadMyInventory(appID, contextID, function (err, inventory) {

    if (err)
      return cb(err);

    self.data[appID + ':' + contextID] = inventory;

    self.rebuildAll();

    return cb(null, inventory);

  });

};

/**
 * Searches for the specified item by id.
 *
 * @param  {String} itemID      Id to search for
 * @param  {String} [appID]     Limit search scope to this game
 * @param  {String} [contextID] Furhter search scope to inventory context
 * @return {Object}             Item if found otherwise null
 */
Inventory.prototype.findItemById = function(itemID, appID, contextID) {

  var self = this;

  return self.data.all.filter(function (item) {

    return (item.id === itemID.toString() &&
            (appID ? item.appid === appID.toString() : true) &&
            (contextID ? item.contextid === parseInt(contextID) : true));

  })[0] || null;

};

/**
 * Rebuilds `Inventory.data.all` from all cached invs.
 *
 * @return {Array} Rebuilt inventory
 */
Inventory.prototype.rebuildAll = function() {

  var self = this;

  // Reset full inventory
  self.data.all = [];

  for (var inventory in self.data) {

    if (inventory !== 'all') {

      for (var i = self.data[inventory].length - 1; i >= 0; i--) {

        self.data.all.push(self.data[inventory][i]);

      }

    }

  }

  return self.data.all;

};
