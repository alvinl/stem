
module.exports = function (bot, botTrade, steamID, botOffers) {

  return new Cmd(bot, botTrade, steamID, botOffers);

};

function Cmd(bot, botTrade, steamID, botOffers) {

  this.bot = bot;
  this.client = steamID;
  this.botTrade = botTrade;
  this.botOffers = botOffers;

}

Cmd.prototype.help = function() {

  var bot = this.bot;
  var client = this.client;

  bot.sendMessage(client, '\n - items (gives amount items in bp)' +
                           '\n - items list (list\'s all items in bp)' +
                           '\n - items metal (give amount of metal in bp)' +
                           '\n - items reload (reload the bots inventory)' +
                           '\n - remove/add friend 123 (replace 123 the users 64bit id)' +
                           '\n - idle on/off (disables/enables idling games)' +
                           '\n - set status (online, busy, tradeready, away, snooze, playready)' +
                           '\n - set botname "BotName" (the name must be in parentheses)' +
                           '\n - enable/disable trade (disables or enables bot trading)' +
                           '\n - version (display\'s the bot\'s version)' +
                           '\n - log off (makes the bot log off)', 1);

};

Cmd.prototype.sendVersion = function(version) {

  var bot = this.bot;
  var client = this.client;

  bot.sendMessage(client, version, 1);

};

Cmd.prototype.addFriend = function(friend) {

  // TODO: allow user to submit profile url

  var bot = this.bot;
  var client = this.client;

  if (!friend || friend.length !== 17) {

    bot.sendMessage(client, 'Invalid steamID', 1);
    return;

  }

  bot.sendMessage(client, 'Friend request sent', 1);
  bot.addFriend(friend);

};

Cmd.prototype.removeFriend = function(friend) {

  // TODO: make sure friend exists in friends list

  var bot = this.bot;
  var client = this.client;

  if (!friend || friend.length !== 17) {

    bot.sendMessage(client, 'Invalid steamID', 1);
    return;

  }

  bot.sendMessage(client, 'Friend removed', 1);
  bot.removeFriend(friend);

};

Cmd.prototype.logOff = function() {

  var bot = this.bot;
  var log = bot.log;

  log.warn('Bot logging off');
  bot.setPersonaState(0);
  bot.logOff();

};

Cmd.prototype.idleOn = function() {

  // TODO: keep track of idle status

  var bot = this.bot;
  var client = this.client;

  bot.sendMessage(client, 'Idling has been turned on');
  bot.gamesPlayed(bot.config.idleGames);

};

Cmd.prototype.idleOff = function() {

  var bot = this.bot;
  var client = this.client;

  bot.sendMessage(client, 'Idling has been turned off');
  bot.gamesPlayed([]);

};

Cmd.prototype.setStatus = function(status) {

  var bot = this.bot;
  var client = this.client;

  // No status given
  if (!status) {

    bot.sendMessage(client, 'Invalid bot status. Valid status\'s are: online, busy, away, snooze, tradeready, and playready', 1);

  }

  switch(status)
  {

    case 'online':
      bot.setPersonaState(1);
      break;

    case 'busy':
      bot.setPersonaState(2);
      break;

    case 'away':
      bot.setPersonaState(3);
      break;

    case 'snooze':
      bot.setPersonaState(4);
      break;

    case 'tradeready':
      bot.setPersonaState(5);
      break;

    case 'playready':
      bot.setPersonaState(6);
      break;

  }

};

Cmd.prototype.setBotname = function(botName) {

  var bot = this.bot;

  // Botname is empty
  if (botName[1] === '' || botName[1] === ' ') {

    bot.setPersonaName('R2D2');
    return;

  }

  bot.setPersonaName(botName[1]);

};

Cmd.prototype.autoAcceptStatus = function(status) {

  var bot = this.bot;

  bot.config.autoAccept = status;

};

Cmd.prototype.items = function() {

  var bot = this.bot;
  var client = this.client;
  var invTradable = bot._invTradable;

  if (!invTradable || invTradable.length === 0) {

    bot.sendMessage(client, 'I currently don\'t have any tradable items.', 1);
    return;

  }

  bot.sendMessage(client, 'I currently have ' + invTradable.length + ' items in my inventory.', 1);

};

Cmd.prototype.listItems = function() {

  var bot = this.bot;
  var client = this.client;
  var invTradable = bot._invTradable;

  if (!invTradable || invTradable.length === 0) {

    bot.sendMessage(client, 'I currently don\'t have any tradable items.', 1);
    return;

  }

  invTradable.forEach(function(item) {

    bot.sendMessage(client, item.name, 1);

  });

};

Cmd.prototype.listMetal = function() {

  var bot = this.bot;
  var client = this.client;
  var invRec = bot._invRec;
  var invRef = bot._invRef;
  var invScrap = bot._invScrap;

  bot.sendMessage(client, 'Scrap: ' + invScrap.length + ' Reclaimed: ' + invRec.length + ' Refined: ' + invRef.length, 1);

};

Cmd.prototype.tradeStatus = function(status) {

  var bot = this.bot;

  bot._tradeReady = status;

};

Cmd.prototype.invReload = function() {

  var bot = this.bot;
  var log = bot.log;
  var client = this.client;
  var botTrade = this.botTrade;
  var debugEnabled = bot.config.debug;

  // Reload the bots inventory
  botTrade.loadInventory(440, 2, function(inv) {

    // Error loading inventory
    if (!inv) {
      log.error('Error loading inventory. Reload inventory with: items reload');
      return;
    }

    if (debugEnabled) {
      log.debug('Inventory reloaded');
    }

    bot._inventory = inv;
    bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
    bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
    bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
    bot._invTradable = inv.filter(function(item) { return item.tradable;});

    bot.sendMessage(client, 'Inventory reloaded');

  });

};

Cmd.prototype.listOffers = function(type) {

  var bot = this.bot;
  var log = this.bot.log;
  var config = bot.config;
  var client = this.client;
  var botOffers = this.botOffers;

  var offerType = {
    active_only: 1,
    time_historical_cutoff: Date.now()
  };

  switch (type)
  {

    case 'sent':
      offerType.get_sent_offers = 1;
      break;

    case 'active':
      offerType.get_received_offers = 1;
      break;

    default:
      offerType.get_received_offers = 1;
      break;

  }

  botOffers.getOffers(offerType, function(err, body) {

    // Error getting trade offers
    if (err) {

      bot.sendMessage(client, 'Error retreiving offers', 1);
      return;

    }

    // No trade offers found
    if (!body) {

      bot.sendMessage(client, 'No trade offers found', 1);
      return;

    }

    var offers = body.response.trade_offers_received;

    offers.forEach(function(offer) {

      var isAdmin = (config.admins.indexOf(offer.steamid_other) > -1) ? 'Yes' : 'No';

      bot.sendMessage(client, '\nOffer from: ' + offer.steamid_other + '\nOfferID: ' + offer.tradeofferid + '\nFrom admin: ' + isAdmin, 1);

    });

  });

};

Cmd.prototype.offerItems = function(offerID) {

  var bot = this.bot;
  var log = this.bot.log;
  var client = this.client;
  var botOffers = this.botOffers;

  if (!offerID) {

    bot.sendMessage(client, 'Please enter a valid OfferID', 1);
    return;

  }

  botOffers.getOffer({ tradeofferid: offerID }, function(err, body) {

    // Error getting trade offers
    if (err) {

      bot.sendMessage(client, 'Error retreiving offers', 1);
      return;

    }

    // No trade offers found
    if (!body) {

      bot.sendMessage(client, 'Trade offer not found', 1);
      return;

    }

    var itemsToGive = body.response.offer.items_to_give;
    var itemsToReceive = body.response.offer.items_to_receive;

    if (itemsToGive) {

      bot.sendMessage(client, 'Items to give:', 1);

      itemsToGive.forEach(function(offerItem) {

        var item = 'http://steamcommunity.com/profiles/'+bot.steamID+'/inventory/#'+offerItem.appid+'_'+offerItem.contextid+'_'+offerItem.assetid;

        bot.sendMessage(client, item, 1);

      });

    }

    if (itemsToReceive) {

      bot.sendMessage(client, 'Items to recieve:', 1);

      itemsToReceive.forEach(function(offerItem) {

        var item = 'http://steamcommunity.com/profiles/'+bot.steamID+'/inventory/#'+offerItem.appid+'_'+offerItem.contextid+'_'+offerItem.assetid;

        bot.sendMessage(client, item, 1);

      });

    }

  });


};

Cmd.prototype.clearChat = function() {

  var bot = this.bot;
  var client = this.client;

  bot.sendMessage(client, '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n', 1);

};
