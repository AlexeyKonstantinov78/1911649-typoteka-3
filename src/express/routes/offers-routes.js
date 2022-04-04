'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();

const {getLogger} = require(`../../service/lib/logger`);
const logger = getLogger({name: `api http offers-routes`});

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.
// Следует помнить, что в первом параметре мы указываем путь маршрута
// без `articles`, т.к. уже указали при подключении модуля маршрута
// в `express.js`.
offersRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
offersRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);

    res.render(`./post/post-edit`, {offer, categories});
  } catch (err) {
    const error = err.message;
    logger.info(error);
    res.render(`./post/post-edit`, {error});
  }
});
offersRouter.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = offersRouter;
