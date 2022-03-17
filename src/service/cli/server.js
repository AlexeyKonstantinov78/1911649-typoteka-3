'use strict';

const express = require(`express`);
const app = express();

const chalk = require(`chalk`);
// const http = require(`http`);
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;

app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    // http.createServer(onClientConnect)
    app
      .listen(port)
      .on(`listening`, (err) => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
