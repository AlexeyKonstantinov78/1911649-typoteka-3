'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
  }

  async findAll() {
    return await this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
