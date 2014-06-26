
module.exports = function (steamID) {
  
  // Clear trade session
  this.tradeSession = {};

  // Set initial trade session data
  this.tradeSession.client = steamID;
  this.tradeSession.eventItems = [];

};