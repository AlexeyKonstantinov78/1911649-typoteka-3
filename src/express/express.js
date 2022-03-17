'use strict';

const express = require(`express`);
const app = express();
const path = require(`path`);
const chalk = require(`chalk`);

// роутер
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

// константы
const PUBLIC_DIR = `public`;
const DEFAULT_PORT = 8080;

// статичные передача данныx как стили скрипты шрифты картинки
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

// подключение шаблонизатора pug и каталог директория шаблонов
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

// Подключим созданные маршруты
app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

// run server
app.listen(DEFAULT_PORT, () => console.log(chalk.green(`Сервер запущен на порту: ${DEFAULT_PORT}`)));
