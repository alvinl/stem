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
  if (e.eresult === 65) {
    log.warn('Enter Steamcode below');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      var code = data.replace('\n', '');
      app.bot.logOn(config.username, config.password, code);
    });
  } else if (e.eresult === 5) {
    log.error('Invalid password, please check that the password in your config is correct');
  }
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