'use strict';

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `filldb`});

const {getRandomInt, shuffle} = require(`../../utils`);
const {MAX_ID_LENGTH, ExitCode} = require(`../../constants`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1; // по умолчанию 1 публикация
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`; // назавание файла
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const generateDate = () => {
  const threeMonts = 777600000;
  const currentTime = new Date().getTime();
  const date = new Date(currentTime - getRandomInt(0, threeMonts));

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    // id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateOffers = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    picture: ``,
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    createdDate: generateDate(),
    categories: getRandomSubarray(categories)
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Попытка подключиться к базе данных...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`Произошла ошибка: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Установлено соединение с базой данных`);

    const {Category, Article} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const titles = await readFile(FILE_TITLES_PATH);
    const sentences = await readFile(FILE_SENTENCES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const comments = await readFile(FILE_COMMENTS_PATH);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const articles = generateOffers(countArticle, titles, categoryModels, sentences, comments);
    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
      await articleModel.addCategories(article.categories);
    });
    await Promise.all(articlePromises);

  }
};
