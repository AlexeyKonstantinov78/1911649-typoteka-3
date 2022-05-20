'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const {OFFERS_PER_PAGE} = require(`../../constants`);

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = OFFERS_PER_PAGE;

  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true) // аргумент
  ]);

  // количество страниц — это общее количество объявлений, поделённое на количество объявлений на странице (с округлением вверх)
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE)

  res.render(`main`, {offers, page, totalPages, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;

  try {
    const results = await api.search(query);

    res.render(`search/search`, {results, query});
  } catch (error) {
    res.render(`search/search`, {results: [], query});
  }
});

module.exports = mainRouter;
