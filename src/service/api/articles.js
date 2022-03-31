'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articlesValidator = require(`../middlewares/articles-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, articlesService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.post(`/`, articlesValidator, (req, res) => {
    const articles = articlesService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articlesService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.put(`/:articleId`, articlesValidator, (req, res) => {
    const {articleId} = req.params;
    const updated = articlesService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const {body} = req.body;
    const article = articlesService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedArticle = articlesService.drop(articleId, body);

    if (!deletedArticle) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, (req, res) => {
    const {articleId} = req.params;
    const comments = commentService.findAll(articleId);

    if(!comments) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found ${articleId}`);
    }

    res.status(HttpCode.OK)
    .json(comments);
  });

  route.post(`/:articleId/comments`, commentValidator, (req, res) => {
    const {articleId} = req.params;
    const comment = commentService.create(articleId, req.body);

    if(!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found ${articleId}`);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, (req, res) => {
    const {articleId, commentId} = req.params;

    const comment = commentService.findOne(commentId, articleId);

    if(!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = commentService.drop(articleId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);

  });
};
