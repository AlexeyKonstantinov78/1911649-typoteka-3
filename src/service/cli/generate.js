'use strict';

const {getRandomInt, shuffle} = require(`../../utils`);
const {MAX_ID_LENGTH} = require(`../../constants`);
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
    console.error(err);
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
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    createdDate: generateDate(),
    category: [categories[getRandomInt(0, categories.length - 1)]]
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {

    const titles = await readFile(FILE_TITLES_PATH);
    const sentences = await readFile(FILE_SENTENCES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const comments = await readFile(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer <= 1000) {
      const content = JSON.stringify(generateOffers(countOffer, titles, sentences, categories, comments));

      await fs.writeFile(FILE_NAME, content)
      .then(() => console.info(chalk.green(`Operation success. File created.`)))
      .catch(() => console.error(chalk.red(`Can't write data to file...`)));

    } else {
      return console.info(chalk.red(`Не больше 1000 публикаций.`));
    }
  }
};
