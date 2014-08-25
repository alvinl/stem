
module.exports = function (Stem) {

  return {

    /**
     * @type {Object}
     */
    _data: {},

    /**
     * Save key / value pair and emit `save`
     *
     * @param {String} key
     * @param {Mixed}  value
     */
    set: function (key, value) {

      this._data[key] = value;

      Stem.emit('save', this._data);

    },

    /**
     * Returns the value of the given key or null if it doesn't exist
     *
     * @param  {String} key
     */
    get: function (key) {

      return this._data.hasOwnProperty(key) ? this._data[key] : null;

    },

    /**
     * Removes a given key if it exists
     *
     * @param  {String} key Key to remove
     */
    remove: function (key) {

      if (this._data.hasOwnProperty(key)) {

        delete this._data[key];

        Stem.emit('save', this._data);
        return;

      }

    }

  };

};
