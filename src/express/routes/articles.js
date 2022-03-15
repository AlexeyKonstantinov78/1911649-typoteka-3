'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/`, (req, res) => res.render(`post/post-detail`));
articlesRouter.get(`/add`, (req, res) => res.render(`post/post`));
articlesRouter.get(`/:id`, (req, res) => res.send(`/articles/:id ${req.params.id}`));
articlesRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id ${req.params.id}`));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id ${req.params.id}`));

module.exports = articlesRouter;
