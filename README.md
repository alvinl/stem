Stem
====
[![Dependency Status](https://david-dm.org/Alvinlz/stem.png)](https://david-dm.org/Alvinlz/stem)   
A simple Steam bot based on [node-steam](https://github.com/seishun/node-steam) that can run on Windows, Mac, and Linux. The bot is still in it's early stages but is stable enough to perform basic actions.
![Stem Screenshot](https://alvinl.com/cache/stem-github.png)
## Features
As of [v0.7.0](https://github.com/Alvinlz/stem/releases/tag/v0.7.0) the bot is capable of the following
- Scrapbanking
- Game idling (can idle multiple games at once)
- Basic trading (can only accept items at the moment)
  - Trade whitelist
  - Trade validation to avoid Steam trade exploits
  - Trade timer
- Auto accepting friend requests
- Basic commands in chat
- Logging

## Installation (Mac / Linux)
- Download and install [node.js](http://nodejs.org/)
  - If you are running linux you can follow [this guide](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) as well
- Run `git clone https://github.com/Alvinlz/stem.git`
  - Alternatively you can just download the zip or tar from github and unzip
- Go into the stem folder
- Run `npm install`
  - If you are on a mac you will need Xcode and the Command Line tools from Xcode 
- Rename the config.example.json file to config.json
- Edit config.json to your needs (only username and password is required)
- Run `node app.js` to start the bot

## Changelog
You can find the changelog [here](https://github.com/Alvinlz/stem/releases)
