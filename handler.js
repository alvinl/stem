// Load Modules

var fs = require('fs')
  , config = require('./config.json')
  , log = require('./logger.js').log
  , app = require('./app.js');


// Servers event
exports.servers = function(servers){
  fs.writeFile('servers.json', JSON.stringify(servers));
};


// Sentry event
exports.sentry = function(hash){
  fs.writeFile(config.username + '.hash', hash, function(err) {
    log.warn('Sentry saved!');
  });
};


// Error event
exports.error = function(e){
  log.error(e);
};


// Logged In event
exports.loggedOn = function(){
  log.info('Bot Logged in!');
  app.bot.setPersonaState(app.steam.EPersonaState.Online);

  if (config.botname) {
    log.info('Changing botname to: ' + config.botname);
    app.bot.setPersonaName(config.botname);
  }
};