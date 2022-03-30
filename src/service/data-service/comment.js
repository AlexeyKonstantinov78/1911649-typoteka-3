'use strict';
const {MAX_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  create(articleId, comment) {
    const comments = this.findAll(articleId);

    if (!comments) {
      return false;
    }

    const newComments = Object
      .assign({id: nanoid(MAX_ID_LENGTH)}, comment);

    comments.push(newComments);
    return comments;
  }

  drop(articleId, commentId) {

    const comment = this.findOne(commentId, articleId);

    if (!comment) {
      return false;
    }

    return !!comment;
  }

  findAll(articleId) {
    const article = this._articles.find((item) => item.id === articleId);

    if (!article) {
      return false;
    }

    return article.comments;
  }

  findOne(id, articleId) {
    const article = this._articles.find((item) => item.id === articleId);

    if (!article) {
      return false;
    }

    return article.comments.find((item) => item.id === id);
  }
}

module.exports = CommentService;
