
/* global describe, it */

var should = require('should');

describe('API', function () {

  it('api.addHandler should attach an event handler to a event and bind `Stem`', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    // Attach a fake handler
    bot.api.addHandler('bot', 'friendMsg', function () {

      // Verify that `this` is Stem
      this.should.have.property('config');
      return done();

    });

    // Call fake handler
    bot.bot.emit('friendMsg');

  });

  it('api.addCommand should create a admin command for all message types', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand(/^help/i, function () {

    }, { permission: 'admin' });

    bot.api.addCommand(/^help/i, function () {

    }, { permission: 'admin', eventType: 'group' });

    bot.api.addCommand(/^help/i, function () {

    }, { permission: 'admin', eventType: 'trade' });

    var messageMatchedCommand = bot.api._matchCommand('help', 'message', true),
        groupMatchedCommand   = bot.api._matchCommand('help', 'group', true),
        tradeMatchedCommand   = bot.api._matchCommand('help', 'trade', true);

    should.exist(messageMatchedCommand);
    should.exist(groupMatchedCommand);
    should.exist(tradeMatchedCommand);
    return done();

  });

  it('api.addCommand should create a normal command for all message types', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand(/^help/i, function () {

    });

    bot.api.addCommand(/^help/i, function () {

    }, { eventType: 'group' });

    bot.api.addCommand(/^help/i, function () {

    }, { eventType: 'trade' });

    var messageMatchedCommand = bot.api._matchCommand('help', 'message'),
        groupMatchedCommand   = bot.api._matchCommand('help', 'group'),
        tradeMatchedCommand   = bot.api._matchCommand('help', 'trade');

    should.exist(messageMatchedCommand);
    should.exist(groupMatchedCommand);
    should.exist(tradeMatchedCommand);
    return done();

  });

  it('api.addCommand should fail to create a command for an invalid eventType', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand(/^help/i, function () {

      }, { eventType: 'invalid' });

    } catch (err) {

      return done();

    }

  });

  it('api.addCommand should fail to create a command for an invalid permission group', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand(/^help/i, function () {

      }, { permission: 'invalid' });

    } catch (err) {

      return done();

    }

  });

  it('api.addCommand should fail to create a command if the command already exists for that eventType', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand(/^help/i, function () {

      });

      bot.api.addCommand(/^help/i, function () {

      });

    } catch (err) {

      return done();

    }

  });

  it('api.addCommand should fail to create a command when passed invalid first param', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand('/^help/i', function () {

      });

    } catch (err) {

      return done();

    }

  });

  it('api.addCommand should fail to create a command when passed invalid second param', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand(/^help/i, 'invalid');

    } catch (err) {

      return done();

    }

  });

  it('api.addCommand should fail to create a command when passed invalid third param', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand(/^help/i, function () {

      }, 'invalid');

    } catch (err) {

      return done();

    }

  });

  it('api.isAdmin should return true if a given steamID is an admin', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    // Create admin
    bot.config.admins = ['76561198042819371'];

    bot.api.isAdmin('76561198042819371').should.be.true;

    return done();

  });

  it('api.isAdmin should return false if a given steamID is not an admin', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    // Create admin
    bot.config.admins = ['76561198042819371'];

    bot.api.isAdmin('76561198042819372').should.be.false;

    return done();

  });

  it('api.validateSteamID should return true if a given string is a valid steamID', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.validateSteamID('76561198042819371').should.be.true;

    return done();

  });

  it('api.validateSteamID should return false if a given string is an invalid steamID', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    // No string passed
    bot.api.validateSteamID(null).should.be.false;

    // Invalid length
    bot.api.validateSteamID('123456789').should.be.false;

    // Non-number
    bot.api.validateSteamID('abcd').should.be.false;

    return done();

  });

  it('api.validateTrade should return false if no trade session data is available', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.validateTrade().should.be.false;

    return done();

  });

  it('api.validateTrade should return false if inventory lengths do not match', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.trade.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2];

    bot.api.validateTrade().should.be.false;

    return done();

  });

  it('api.validateTrade should return false if inventories do not match', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.trade.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2, 4];

    bot.api.validateTrade().should.be.false;

    return done();

  });

  it('api.validateTrade should return true if inventories match', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.trade.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2, 3];

    bot.api.validateTrade().should.be.true;

    return done();

  });

});
