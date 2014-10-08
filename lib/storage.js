
/**
 * A module to handle bot storage
 *
 * @module Storage
 */

/**
 * Dependencies
 */

var util   = require('util'),
    events = require('events');

/**
 * Export `Storage`
 */

module.exports = Storage;

/**
 * Creates a new `Storage` instance
 *
 * @class
 */
function Storage (stem) {

  this.stem = stem;
  this.data = {};

  events.EventEmitter.call(this);

}

util.inherits(Storage, events.EventEmitter);

/**
 * Saves key / value pair and emits `change`
 *
 * @param {String} key
 * @param {Mixed}  value
 */
Storage.prototype.set = function(key, value) {

  this.data[key] = value;

  this.emit('change', this.data);

};

/**
 * Returns the value of the specified key
 *
 * @param  {String} key
 * @return {Mixed}      Key data or null if key doesn't exist
 */
Storage.prototype.get = function(key) {

  return this.data.hasOwnProperty(key) ? this.data[key] : null;

};

/**
 * Removes the specified key from storage
 *
 * @param  {String} key Key to remove
 * @return {Boolean}    True if a key was removed, otherwise false
 */
Storage.prototype.remove = function(key) {

  // Key doesn't exist
  if (!this.data.hasOwnProperty(key))
    return false;

  delete this.data[key];

  this.emit('change', this.data);

  return true;

};

/**
 * Loads and merges the given object to `this.data`,
 * emits `loaded` once completed.
 *
 * @param  {Object} dataToLoad Data to load
 */
Storage.prototype.load = function(dataToLoad) {

  var self = this;

  for (var data in dataToLoad)
    self.data[data] = dataToLoad[data];

  self.emit('loaded', self.data);

};
