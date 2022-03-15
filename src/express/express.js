'use strict';

const express = require(`express`);
const app = express();
const path = require(`path`);
const DEFAULT_PORT = 8080;

const chalk = require(`chalk`);
// роутер
const articlesRouter = require(`./routes/articles`);
const muRouter = require(`./routes/my`);

// подключение шаблонизатора pug и каталог директория шаблонов
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.get(`/`, (req, res) => {
  res.render(`main`);
});

app.use(`/articles`, articlesRouter);
app.use(`/my`, muRouter);

app.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

app.get(`/login`, (req, res) => {
  res.render(`login`);
});

app.get(`/search`, (req, res) => {
  res.render(`search/search`);
});

app.get(`/post`, (req, res) => {
  res.render(`post-detail`);
});

app.listen(DEFAULT_PORT, () => console.log(chalk.green(`Сервер запущен на порту: ${DEFAULT_PORT}`)));

