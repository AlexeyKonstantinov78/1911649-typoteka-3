'use strict';

const express = require(`express`);
const request = require(`supertest`);

const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `Без рамки`,
  `Кино`,
  `Программирование`,
  `За жизнь`,
  `Железо`,
  `IT`
];

const mockData = [{
  "id": "BDp1-D",
  "title": ["Рок — это протест"],
  "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.",
  "fullText": "Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина.",
  "comments": [{
    "id": "lI2ofR",
    "text": "С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?"
  }, {
    "id": "ENnLBg",
    "text": "Совсем немного..."
  }, {
    "id": "OHy7h9",
    "text": "А сколько игр в комплекте? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-27 3:0:25",
  "category": ["Деревья"]
}, {
  "id": "n4n_VS",
  "title": ["Самый лучший музыкальный альбом этого года"],
  "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
  "fullText": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов.",
  "comments": [{
    "id": "Zl-upP",
    "text": "Вы что?! В магазине дешевле. Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?"
  }, {
    "id": "FywKlZ",
    "text": "Продаю в связи с переездом. Отрываю от сердца."
  }, {
    "id": "KI89aa",
    "text": "Почему в таком ужасном состоянии? А сколько игр в комплекте?"
  }],
  "createdDate": "2022-2-26 22:43:20",
  "category": ["Без рамки"]
}, {
  "id": "6l_eQv",
  "title": ["Как достигнуть успеха не вставая с кресла"],
  "announce": "Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха.` Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят.",
  "comments": [{
    "id": "GeNBgI",
    "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А сколько игр в комплекте?"
  }, {
    "id": "aLfzN5",
    "text": "А сколько игр в комплекте? Неплохо, но дорого. Совсем немного..."
  }, {
    "id": "Mj_D69",
    "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-19 23:23:3",
  "category": ["Без рамки"]
}, {
  "id": "RTEqr1",
  "title": ["Борьба с прокрастинацией"],
  "announce": "Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят.",
  "comments": [{
    "id": "qmygl4",
    "text": "Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?"
  }, {
    "id": "XtGh_U",
    "text": "Оплата наличными или перевод на карту? А сколько игр в комплекте?"
  }, {
    "id": "s1oGXd",
    "text": "Совсем немного... А где блок питания? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-22 16:35:5",
  "category": ["Кино"]
}, {
  "id": "774hVb",
  "title": ["Учим HTML и CSS"],
  "announce": "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.",
  "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
  "comments": [{
    "id": "yDTcp1",
    "text": "Оплата наличными или перевод на карту?"
  }],
  "createdDate": "2022-2-27 2:27:25",
  "category": ["Деревья"]
}, {
  "id": "xBSpPS",
  "title": ["Борьба с прокрастинацией"],
  "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.",
  "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой.",
  "comments": [{
    "id": "mBNMUx",
    "text": "С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-20 6:6:27",
  "category": ["Программирование"]
}, {
  "id": "_BmHWc",
  "title": ["Ёлки. История деревьев"],
  "announce": "Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
  "fullText": "Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.",
  "comments": [{
    "id": "xbt53C",
    "text": "Неплохо, но дорого. А сколько игр в комплекте? Совсем немного..."
  }, {
    "id": "vs7bcG",
    "text": "С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Неплохо, но дорого."
  }],
  "createdDate": "2022-2-27 0:4:7",
  "category": ["Без рамки"]
}, {
  "id": "sVOj3M",
  "title": ["Как собрать камни бесконечности"],
  "announce": "Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха.` Как начать действовать? Для начала просто соберитесь.",
  "fullText": "Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина.",
  "comments": [{
    "id": "4GXmIU",
    "text": "Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?"
  }, {
    "id": "HlFbze",
    "text": "С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-21 21:52:11",
  "category": ["За жизнь"]
}, {
  "id": "XDdSm2",
  "title": ["Как начать программировать"],
  "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой.",
  "comments": [{
    "id": "NZ1xuA",
    "text": "А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого."
  }],
  "createdDate": "2022-2-23 23:15:35",
  "category": ["Железо"]
}, {
  "id": "7lh8df",
  "title": ["Борьба с прокрастинацией"],
  "announce": "Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят.",
  "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция.",
  "comments": [{
    "id": "sLd2rq",
    "text": "Неплохо, но дорого."
  }, {
    "id": "t5lW0e",
    "text": "Вы что?! В магазине дешевле."
  }, {
    "id": "416cb4",
    "text": "Неплохо, но дорого. С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-21 20:46:10",
  "category": ["IT"]
}];

const {DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const mockDB = new Sequelize(
    `buy_and_sel_test`, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      },
      logging: false});

const app = express();
app.use(express.json());
// search(app, new DataService(mockData));

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки. История деревьев`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 articles found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].title).toBe(`Борьба с прокрастинацией`));

  test(`API returns code 404 if nothing is found`,
  () => request(app)
    .get(`/search`)
    .query({
      query: `Продам свою дуу`
    })
    .expect(HttpCode.NOT_FOUND)
  );

  test(`API returns 400 when query string is absent`,
  () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
  );
});
