'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

const cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  cli,
};
