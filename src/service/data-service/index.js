'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const ArticlesService = require(`./articles`);
const CommentService = require(`./comment`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  ArticlesService,
};
