
module.exports = function() {

  var Stem          = this,
      log           = this.log,
      bot           = this.bot,
      customBotname = this.config.botname;

  // Sanitize config
  delete Stem.config.password;
  
  // Log successful login
  log.info('Bot successfully logged in');

  // Set the bots status to 'Online'
  bot.setPersonaState(1);

  // Change botname if set in config
  if (customBotname) {

    log.info('Changing botname to: %s', customBotname);

    bot.setPersonaName(customBotname);

  }

};
