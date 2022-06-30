'use strict';

const express = require(`express`);
const app = express();
const path = require(`path`);

//сейсии
const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

// роутер
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

// константы
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const DEFAULT_PORT = 8080;

const {getLogger} = require(`../service/lib/logger`);
const logger = getLogger({name: `api http`});

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

// статичные передача данныx как стили скрипты шрифты картинки
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
// app.use(express.json());

// подключение шаблонизатора pug и каталог директория шаблонов
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

// Подключим созданные маршруты
app.use(`/articles`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

// run server
app.listen(DEFAULT_PORT, () => logger.info(`Сервер запущен на порту: ${DEFAULT_PORT}`));
