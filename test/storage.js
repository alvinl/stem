
/* global describe, it */

var should = require('should');

describe('Storage', function () {

  it('storage.set should store the given key and its value', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.storage.set('bool', true);
    bot.storage.set('string', 'test');
    bot.storage.set('array', [1, 2, 3]);
    bot.storage.set('num', 101);
    bot.storage.set('obj', { 'test1': true, 'test2': false });

    bot.storage._data.should.have.property('bool');
    bot.storage._data.should.have.property('string');
    bot.storage._data.should.have.property('array');
    bot.storage._data.should.have.property('num');
    bot.storage._data.should.have.property('obj');

    return done();

  });

  it('storage.get should return the given keys value', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.storage.set('bool', true);
    bot.storage.set('string', 'test');
    bot.storage.set('array', [1, 2, 3]);
    bot.storage.set('num', 101);
    bot.storage.set('obj', { 'test1': true, 'test2': false });

    var string = bot.storage.get('string'),
        array  = bot.storage.get('array'),
        bool   = bot.storage.get('bool'),
        obj    = bot.storage.get('obj'),
        num    = bot.storage.get('num');

    string.should.eql('test');
    array.should.eql([1, 2, 3]);
    bool.should.eql(true);
    obj.should.eql({ 'test1': true, 'test2': false });
    num.should.eql(101);

    return done();

  });

  it('storage.remove should remove the given key from storage', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.storage.set('bool', true);
    bot.storage.set('string', 'test');
    bot.storage.set('array', [1, 2, 3]);
    bot.storage.set('num', 101);
    bot.storage.set('obj', { 'test1': true, 'test2': false });

    Object.keys(bot.storage._data).length.should.eql(5);

    var keysToRemove = ['bool', 'string', 'array', 'num', 'obj'];

    keysToRemove.forEach(function (keyToRemove) {

      bot.storage.remove(keyToRemove);

    });

    Object.keys(bot.storage._data).length.should.eql(0);

    return done();

  });

  it('storage.set should emit `save`', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.on('save', function (data) {

      Object.keys(data).length.should.eql(1);
      return done();

    });

    bot.storage.set('string', 'test');

  });

  it('storage.remove should emit `save`', function (done) {

    var Stem = require('../lib'),
        bot  = new Stem();

    bot.storage.set('string', 'test');

    bot.on('save', function (data) {

      Object.keys(data).length.should.eql(0);
      return done();

    });

    bot.storage.remove('string');

  });

});
