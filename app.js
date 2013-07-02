var Steam = exports = require('steam')
  , winston = require('winston')
  , fs = require('fs')
  , servers = require('./servers.js')
  , config = require('./config.json')
  , bot = new Steam.SteamClient();

var username = config.username
  , password = config.password;

var steamGuard = require('fs').existsSync(config.username + '.hash') ? require('fs').readFileSync(config.username + '.hash') : '';

var log = exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true, colorize: true }),
    new (winston.transports.File)({ filename: config.username + '.log' })
  ]
});

bot.logOn(username, password, steamGuard);

bot.on('loggedOn', function() {
  log.info('Bot Logged in!')
  bot.setPersonaState(Steam.EPersonaState.Online);

  if (config.botname) {
    log.info('Changing botname to: ' + config.botname);
    bot.setPersonaName(config.botname);
  }
});

bot.on('error', function(e) {
  console.log(e);
});

bot.on('sentry', function(hash) {
  fs.writeFile(config.username + '.hash', hash, function(err) {
    log.warn('Sentry saved!');
  });
});

bot.on('servers', function(servers) {
  fs.writeFile('servers.json', JSON.stringify(servers));
});