
module.exports = function(e) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var errorCode = e.eresult;
  var debugEnabled = config.debug;

  // Log everything if debug is on
  if (debugEnabled) {
    log.debug(e);
  }

  // A sentry is requested
  if (errorCode === 63) {

    log.warn('Enter SteamGuard code below...');
    process.stdout.write('Code: ');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      // Attempt to login again with the Auth code
      bot.logOn({
        accountName: config.username,
        password: config.password,
        authCode: data.replace('\n', '')
      });
    });

  }

  // Password is wrong
  if (errorCode === 5) {

    log.error('Invalid password, please check that the password in your config is correct');

  }

  // Invalid Auth code
  if (errorCode === 65) {

    log.error('Invalid Auth code');
    process.kill();

  }

};