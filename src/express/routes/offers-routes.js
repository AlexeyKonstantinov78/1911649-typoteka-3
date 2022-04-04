'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray} = require('../../utils');

const {getLogger} = require(`../../service/lib/logger`);
const logger = getLogger({name: `api http offers-routes`});

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.
// Следует помнить, что в первом параметре мы указываем путь маршрута
// без `articles`, т.к. уже указали при подключении модуля маршрута
// в `express.js`.
offersRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
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

offersRouter.get(`/add`, async (req, res) => {
  const categorys = await api.getCategories();

  res.render(`./post/post`, {categorys});
});

offersRouter.get(`/:id`, (req, res) => res.send(`/articles/:id`));

offersRouter.post(`/add`,
  upload.single(`avatar`), // применяем middleware
  async (req, res) => {

  //  в `body` содержатся текстовые данные формы
  // в `file` — данные о сохранённом файле

    // const {body, file} = req;
    const {body, file} = req;

    console.log(body);

    const offerData = {
      title: body.title,
      announce: body.announcement,
      fullText: body.fullText,
      createdDate: body.date,
      category: ensureArray(body.category),
    };

    try {
      await api.createOffer(offerData);
      res.redirect(`/my`);
    } catch (error) {
      res.redirect(`back`);
    }
  }
);

module.exports = offersRouter;
