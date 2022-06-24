'use strict';

const Joi = require(`joi`);
const {HttpCode, ErrorArticleMessage} = require(`../../constants`);

const schema = Joi.object({
  title: Joi.string().min(10).max(100).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  fullText: Joi.string().max(1000).messages({
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX
  }),
  picture: Joi.string().messages({
    'string.empty': ErrorArticleMessage.PICTURE
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required()
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
