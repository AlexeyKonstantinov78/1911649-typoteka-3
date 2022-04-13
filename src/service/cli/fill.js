'use strict';

const {getRandomInt, shuffle} = require(`../../utils`);
// const {MAX_ID_LENGTH} = require(`../../constants`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
// const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1; // по умолчанию 1 публикация
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db2.sql`; // назавание файла
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

// const generateDate = () => {
//   const threeMonts = 777600000;
//   const currentTime = new Date().getTime();
//   const date = new Date(currentTime - getRandomInt(0, threeMonts));

//   return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
// };

const generateComments = (count, articlesId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    articleId: articlesId,
    userId: getRandomInt(1, userCount),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = (count, titles, sentences, categories, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {

    const titles = await readFile(FILE_TITLES_PATH);
    const sentences = await readFile(FILE_SENTENCES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const comments = await readFile(FILE_COMMENTS_PATH);

    const [count] = args;

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      }, {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    if (countOffer <= 1000) {

      const articles = generateOffers(countOffer, titles, sentences, categories, users.length, comments);

      const comments = articles.flatMap((article) => article.comments);

      const articlesCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

      const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      ).join(`,\n`);

      const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

      const articleValues = articles.map(
        ({title, description, fullText, picture, userId}) =>
          `('${title}', '${description}', '${fullText}', '${picture}', ${userId})`
      ).join(`,\n`);

      const offerCategoryValues = articlesCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
      ).join(`,\n`);

      const commentValues = comments.map(
        ({articleId, userId, text}) =>
          `('${text}', ${userId}, ${articleId})`
      ).join(`,\n`);

      const content = `
        INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
        ${userValues};
        INSERT INTO categories(name) VALUES
        ${categoryValues};
        ALTER TABLE offers DISABLE TRIGGER ALL;
        INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
        ${articleValues};
        ALTER TABLE offers ENABLE TRIGGER ALL;
        ALTER TABLE offer_categories DISABLE TRIGGER ALL;
        INSERT INTO offer_categories(offer_id, category_id) VALUES
        ${offerCategoryValues};
        ALTER TABLE offer_categories ENABLE TRIGGER ALL;
        ALTER TABLE comments DISABLE TRIGGER ALL;
        INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
        ${commentValues};
        ALTER TABLE comments ENABLE TRIGGER ALL;`;


      await fs.writeFile(FILE_NAME, content)
      .then(() => console.info(chalk.green(`Operation success. File created.`)))
      .catch(() => console.error(chalk.red(`Can't write data to file...`)));

    } else {
      return console.info(chalk.red(`Не больше 1000 публикаций.`));
    }
  }
};
