var log4_config = '';

if (process.env.NODE_ENV == `development`) {
  log4_config = require('./log4_config.dev.js');
} else {
  log4_config = require('./log4_config');
}

module.exports = log4_config;
