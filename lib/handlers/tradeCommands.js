
module.exports = function(bot, botTrade) {
  
  return new TradeCmd(bot, botTrade);

};

function TradeCmd(bot, botTrade) {

  this.botTrade = botTrade;
  this.bot = bot;

}

TradeCmd.prototype.help = function() {

  var botTrade = this.botTrade;

  botTrade.chatMsg('\ngive scrap (gives all scrap)\n' +
                   'give reclaimed (gives all reclaimed metal)\n' +
                   'give refined (gives all refined metal)\n' +
                   'give keys (gives all keys)');

};

TradeCmd.prototype.giveAll = function() {

  var tradableItems = this.bot._invTradable;
  var botTrade = this.botTrade;

  if (!tradableItems || tradableItems.length === 0) {

    botTrade.chatMsg('Sorry, I don\'t have any tradable items.');
    return;

  }

  tradableItems.forEach(function(item) {

    botTrade.addItem(item);

  });

};

TradeCmd.prototype.giveScrap = function() {

  var invScrap = this.bot._invScrap;
  var botTrade = this.botTrade;

  if (!invScrap || invScrap.length === 0) {

    botTrade.chatMsg('Sorry, I don\'t have any Scrap.');
    return;

  }

  invScrap.forEach(function(scrap) {

    botTrade.addItem(scrap);

  });

};


TradeCmd.prototype.giveRec = function() {

  var invRec = this.bot._invRec;
  var botTrade = this.botTrade;

  if (!invRec || invRec.length === 0) {

    botTrade.chatMsg('Sorry, I don\'t have any Reclaimed metal.');
    return;

  }

  invRec.forEach(function(rec) {

    botTrade.addItem(rec);

  });

};

TradeCmd.prototype.giveRef = function() {

  var invRef = this.bot._invRef;
  var botTrade = this.botTrade;

  if (!invRef || invRef.length === 0) {

    botTrade.chatMsg('Sorry, I don\'t have any Refined metal.');
    return;

  }

  invRef.forEach(function(ref) {

    botTrade.addItem(ref);

  });

};

TradeCmd.prototype.giveKeys = function() {

  var invKeys = this.bot._inventory.filter(function(item) { return item.name === 'Mann Co. Supply Crate Key'; });
  var botTrade = this.botTrade;

  if (!invKeys || invKeys.length === 0) {

    botTrade.chatMsg('Sorry, I don\'t have any Keys.');
    return;

  }

  invKeys.forEach(function(key) {

    botTrade.addItem(key);

  });

};
