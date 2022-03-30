'use strict';

const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: true
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
