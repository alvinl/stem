
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
  
  it('api.addCommand should create a regular command', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand('normal command', function () {});

    bot.commands.normal.should.have.property('normal command');

    return done();

  });

  it('api.addCommand should fail to create a command when passed an invalid parameter', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    try {

      bot.api.addCommand('normal command', 'invalid param');

    } catch (e) {

      should.exist(e);
      return done();

    }

  });

  it('api.addCommand should fail to create a regular command when the command already exists', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand('normal command', function () { });

    try {

      bot.api.addCommand('normal command', function () { });

    } catch (e) {

      should.exist(e);
      return done();

    }

  });

  it('api.addCommand(.., .., true) should create a admin command', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand('admin command', function () {}, 1);

    bot.commands.admin.should.have.property('admin command');

    return done();

  });

  it('api.addCommand(.., .., true) should fail to create a admin command when the command already exists', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.api.addCommand('admin command', function () { }, 1);

    try {

      bot.api.addCommand('admin command', function () { }, 1);

    } catch (e) {

      should.exist(e);
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

    bot.tradeSession.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2];

    bot.api.validateTrade().should.be.false;

    return done();

  });

  it('api.validateTrade should return false if inventories do not match', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.tradeSession.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2, 4];

    bot.api.validateTrade().should.be.false;

    return done();

  });

  it('api.validateTrade should return true if inventories match', function (done) {
    
    var Stem = require('../lib'),
        bot  = new Stem();

    bot.tradeSession.eventItems = [1, 2, 3];
    bot.botTrade.themAssets = [1, 2, 3];

    bot.api.validateTrade().should.be.true;

    return done();

  });

});
