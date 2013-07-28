
/*
 * 
 * error handler
 *
 * - Description - 
 * Handles the event for when the bot encounters
 * a error
 * 
 */


// Require modules
var config = require('./../../config.json')
  , app = require('./../../app.js')
  , log = require('./../logger.js');


// Export module
module.exports = function(e){

  // Log all errors if debug is on
  if (config.debug) {
    log.warn(e);
  }

  // Sentry is invalid, try sending email auth code
  if (e.eresult === 63) {

    // Login with standard username + password to send email code
    log.warn('Enter SteamGuard code below');
    process.stdout.write('Code: ');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      app.bot.logOn({
        accountName: config.username,
        password: config.password,
        authCode: data.replace('\n', '')
      });
    });

  // Password is just plain wrong
  } else if (e.eresult === 5) {

    log.error('Invalid password, please check that the password in your config is correct');

  } else if (e.eresult === 65) {

    log.error('Invalid Auth code');
    process.kill();

  }

};