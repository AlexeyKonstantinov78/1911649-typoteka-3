'use strict';
const {MAX_ID_LENGTH} = require(`../../constants`);

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
    const deletedRows = await this._Comment.destroy({
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

  async findOne(id, articleId) {
    return await this._Comment.findOne({
      where: {
        id,
        articleId
      }
    });
  }
}

module.exports = CommentService;
