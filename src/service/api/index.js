'use strict';

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {Router} = require(`express`);
const category = require(`../api/category`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);

const {
  CategoryService,
  CommentService,
  SearchService,
  ArticlesService,
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  articles(app, new ArticlesService(sequelize), new CommentService(sequelize));
})();

module.exports = app;
