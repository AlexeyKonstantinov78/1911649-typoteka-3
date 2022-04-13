'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);
const fill = require(`./fill`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
};

module.exports = {
  Cli,
};
