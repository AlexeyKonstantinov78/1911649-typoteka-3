'use strict';

const express = require(`express`);
const app = express();
const DEFAULT_PORT = 8080;
const chalk = require(`chalk`);

const articlesRouter = require(`./routes/articles`);
const muRouter = require(`./routes/my`);

app.use(`/articles`, articlesRouter);
app.use(`/my`, muRouter);

app.get(`/`, (req, res) => {
  res.send(`/`);
});

app.get(`/register`, (req, res) => {
  res.send(`/register`);
});

app.get(`/login`, (req, res) => {
  res.send(`/login`);
});

app.get(`/search`, (req, res) => {
  res.send(`/search`);
});

app.listen(DEFAULT_PORT, () => console.log(chalk.green(`Сервер запущен на порту: ${DEFAULT_PORT}`)));

