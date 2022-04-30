'use strict';
const {MAX_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
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
