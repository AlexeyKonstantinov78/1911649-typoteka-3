'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const [offers, categorys] = await Promise.all([
    api.getOffers(),
    api.getCategories()
  ]);
  res.render(`./post/articles-by-category`, {offers, categorys});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers();
  console.log({offers: offers.slice(0, 3)});
  res.render(`./post/comments`, {offers: offers.slice(0, 3)});
});

module.exports = myRouter;
