'use strict';
const {MAX_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

class CommentService {
  constructor(articles) {
    this._articles = articles;

  }

  create(articleId, comment) {
    const comments = this.findAll(articleId);

    const newComments = Object
      .assign({id: nanoid(MAX_ID_LENGTH)}, comment);

    comments.push(newComments);
    return comments;
    // return this._articles.create();
  }

  drop(articleId, commentId) {
    const comment = this.findOne(commentId, articleId);

    if (!comment) {
      return !!comment;
    }

    return !!comment;
  }

  findAll(articleId) {
    return this._articles.find((item) => item.id === articleId).comments;
  }

  findOne(id, articleId) {
    const article = this._articles.find((item) => item.id === articleId).comments;

    return article.find((item) => item.id === id);
  }
}

module.exports = CommentService;
