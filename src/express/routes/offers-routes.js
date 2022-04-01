'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const offersRouter = new Router();

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.
// Следует помнить, что в первом параметре мы указываем путь маршрута
// без `offers`, т.к. уже указали при подключении модуля маршрута
// в `express.js`.
offersRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
offersRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
offersRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
offersRouter.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = offersRouter;
