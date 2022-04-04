'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [offers, categorys] = await Promise.all([
    api.getOffers(),
    api.getCategories()
  ]);

  res.render(`main`, {offers, categorys});
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
