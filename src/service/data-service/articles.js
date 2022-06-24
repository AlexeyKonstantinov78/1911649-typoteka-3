'use strict';

const Aliase = require(`../models/aliase`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne(articleId) {
    const options = {
      include: [Aliase.CATEGORIES],
      where: [{id: articleId}]
    };

    return await this._Article.findOne(options);
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`id`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = ArticlesService;
