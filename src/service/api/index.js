'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  CommentService,
  SearchService,
  ArticlesService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticlesService(mockData), new CommentService(mockData));
})();

module.exports = app;
