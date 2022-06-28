'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articlesValidator = require(`../middlewares/articles-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExists = require(`../middlewares/article-exists`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articlesService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {article, limit, comments} = req.query;

    let result;

    if (limit || article) {
      result = await articlesService.findPage({limit, article});
    } else {
      result = await articlesService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
  });

  route.post(`/`, articlesValidator, async (req, res) => {
    const articles = await articlesService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;

    const article = await articlesService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, articlesValidator, articleExists(articlesService)], async (req, res) => {
    const {articleId} = req.params;
    const updated = await articlesService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, [routeParamsValidator, articleExists(articlesService)], async (req, res) => {
    const {articleId} = req.params;
    const {body} = req.body;

    const deletedArticle = articlesService.drop(articleId, body);

    if (!deletedArticle) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articlesService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
    .json(comments);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articlesService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articlesService)], async (req, res) => {
    const {articleId, commentId} = req.params;

    const comment = await commentService.findOne(commentId, articleId);

    if(!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = await commentService.drop(articleId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);

  });
};
