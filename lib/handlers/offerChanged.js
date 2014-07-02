
module.exports = function (itemAdded, item) {
  
  var Stem    = this,
      itemPos = Stem.trade.eventItems.indexOf(item);

  // Add item to `eventItems` to be validated later
  if (itemAdded)
    Stem.trade.eventItems.push(item);

  // Remove item from `eventItems` if it exists and the item was removed
  // from trade
  else if (!itemAdded && ~itemPos)
    Stem.trade.eventItems.splice(itemPos, 1);

};