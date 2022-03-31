'use strict';

const pino = require(`pino`);
const {Env} = require(`../../constants`);

console.log(Env);

const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

console.log(`isDevMode: ` + isDevMode);
console.log(`LOG_LEVEL: ` + process.env.LOG_LEVEL);
console.log(`NODE_ENV: ` + process.env.NODE_ENV);
console.log(`Env.DEVELOPMENT: `, Env.DEVELOPMENT);

const defaultLogLevel = isDevMode ? `debug` : `error`;

console.log('defaultLogLeve: ', defaultLogLevel);
console.log(`logger.level: `, process.env.LOG_LEVEL || defaultLogLevel);

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
