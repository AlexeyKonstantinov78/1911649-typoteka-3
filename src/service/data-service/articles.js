'use strict';
const {MAX_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH)}, offer, {comments: []});

    this._articles.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offer = this._articles.find((item) => item.id === id);

    if (!offer) {
      return null;
    }

    this._offers = this._articles.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticles = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticles, article);
  }
}

module.exports = ArticlesService;
