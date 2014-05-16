
module.exports = function(e) {

  var Stem      = this,
      log       = this.log,
      bot       = this.bot,
      errorCode = e.eresult,
      config    = this.config;

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
        password:    config.password,
        authCode:    data.replace('\n', '')
      });

      // Sanitize config
      delete Stem.config.password;

    });

  }

  // Password is wrong
  else if (errorCode === 5) {

    log.error('Invalid password, please check that the password in your config is correct');

  }

  // Invalid Auth code
  else if (errorCode === 65) {

    log.error('Invalid Auth code');
    process.kill();

  } 

  // Unkown error
  else {

    log.error(e);

  }

};