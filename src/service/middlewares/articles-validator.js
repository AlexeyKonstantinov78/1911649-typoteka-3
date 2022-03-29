'use strict';

const {HttpCode} = require(`../../constants`);

const articlesKeys = [`title`, `announce`, `fullText`, `createdDate`, `category`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = articlesKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
};
