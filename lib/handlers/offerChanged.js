
module.exports = function(change, item, bot, botTrade) {
  
  var log = bot.log;
  var config = bot.config;
  var scrapbankEnabled = bot.config.scrapbank;

  // Log what item has been removed / added
  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Push or remove items to validate later
  if (change) {
    bot._clientInv.push(item);
  } else if (!change) {
    bot._clientInv.pop();
  }

  // Scrapbank if enabled
  if (scrapbankEnabled) {
    if (item.tags && item.tags.some(function(tag) {
      return ~['primary', 'secondary', 'melee', 'pda2'].indexOf(tag.internal_name);
    }) && (item.descriptions === '' || !item.descriptions.some(function(desc) {
      return desc.value === '( Not Usable in Crafting )';
    }))) {
      // this is a craftable weapon
      bot._invWeps += change ? 1 : -1;
      if (bot._addedScrap.length !== Math.floor(bot._invWeps / 2)) {
        // need to change number of scrap
        if (change && bot._invScrap.length > bot._addedScrap.length) {
          log.warn('Adding scrap to trade');
          var newScrap = bot._invScrap[bot._addedScrap.length];
          botTrade.addItems([newScrap]);
          bot._addedScrap.push(newScrap);
        } else if (!change && bot._addedScrap.length > Math.floor(bot._invWeps / 2)) {
          log.warn('Removing scrap from trade');
          var scrapToRemove = bot._addedScrap.pop();
          botTrade.removeItem(scrapToRemove);
        }
      }
    }
  }

};