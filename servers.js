var Steam = require('./app.js')
  , fs = require('fs');

if (fs.existsSync('servers.json')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers.json'));
};