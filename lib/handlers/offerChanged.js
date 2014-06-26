
module.exports = function (itemAdded, item) {
  
  var Stem    = this,
      itemPos = Stem.tradeSession.eventItems.indexOf(item);

  // Add item to `eventItems` to be validated later
  if (itemAdded)
    Stem.tradeSession.eventItems.push(item);

  // Remove item from `eventItems` if it exists and the item was removed
  // from trade
  else if (!itemAdded && ~itemPos)
    Stem.tradeSession.eventItems.splice(itemPos, 1);

};