'use strict';

const express = require(`express`);
const app = express();
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const {HttpCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);
// импортируем модуль, созданный на предыдущем шаге
const sequelize = require(`../lib/sequelize`);

const DEFAULT_PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.get(`/posts`, async (req, res) => {
  try {
    const mockData = await getMockData();
    res.json(mockData);
  } catch (_err) {
    res.send([]);
  }
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      logger.info(`Попытка подключиться к базе данных...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Установлено соединение с базой данных`);

    try {
      app
      .listen(port)
      .on(`listening`, (err) => {
        logger.info(`Ожидаю соединений на порт: ${port}`);
      })
      .on(`error`, ({message}) => {
        logger.error(`Ошибка при создании сервера: ${message}`);
      });
    } catch (err) {
      logger.error(`Произошла ошибка ${err.message}`);
      process.exit(1);
    }
  }
};
