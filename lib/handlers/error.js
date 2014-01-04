
module.exports = function(e) {
  
  var bot = this;
  var config = bot.config;
  var errorCode = e.eresult;

  // Log everything if debug is on
  if (config.debug) {
    console.error(e);
  }

  // A sentry is requested
  if (errorCode === 63) {

    console.log('Enter SteamGuard code below...');
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

    console.error('Invalid password, please check that the password in your config is correct');

  }

  // Invalid Auth code
  if (errorCode === 65) {

    console.error('Invalid Auth code');
    process.kill();

  }

};