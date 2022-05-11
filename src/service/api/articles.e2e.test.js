'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);

const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentService = require(`../data-service/comment`);


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
  "id": "aYnqTV",
  "title": "Что такое золотое сечение",
  "announce": "Простые ежедневные упражнения помогут достичь успеха.` Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.",
  "fullText": "Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.",
  "comments": [{
    "id": "hizjLw",
    "text": "А где блок питания? Вы что?! В магазине дешевле. А сколько игр в комплекте?"
  }, {
    "id": "7cQDXE",
    "text": "Почему в таком ужасном состоянии?"
  }, {
    "id": "PrRGOh",
    "text": "Совсем немного... Продаю в связи с переездом. Отрываю от сердца."
  }, {
    "id": "V1pMd5",
    "text": "А сколько игр в комплекте? Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-29 8:11:59",
  "category": ["Железо"]
}, {
  "id": "MRFsQk",
  "title": "Что такое золотое сечение",
  "announce": "Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.",
  "fullText": "Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.",
  "comments": [{
    "id": "XeHiSz",
    "text": "С чем связана продажа? Почему так дешёво? А где блок питания?"
  }, {
    "id": "r9GM4Y",
    "text": "Совсем немного... Почему в таком ужасном состоянии? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-21 22:8:47",
  "category": ["За жизнь"]
}, {
  "id": "caenj9",
  "title": "Борьба с прокрастинацией",
  "announce": "Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов.",
  "fullText": "Как начать действовать? Для начала просто соберитесь. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.",
  "comments": [{
    "id": "_LLc0v",
    "text": "С чем связана продажа? Почему так дешёво?"
  }, {
    "id": "POfli1",
    "text": "Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?"
  }, {
    "id": "dBby4I",
    "text": "С чем связана продажа? Почему так дешёво?"
  }, {
    "id": "rOLzwR",
    "text": "Вы что?! В магазине дешевле. Совсем немного... А сколько игр в комплекте?"
  }],
  "createdDate": "2022-2-27 16:1:13",
  "category": ["Железо"]
}, {
  "id": "L8BLEb",
  "title": "Как собрать камни бесконечности",
  "announce": "Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения.",
  "fullText": "Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха.`",
  "comments": [{
    "id": "WmwfZR",
    "text": "Продаю в связи с переездом. Отрываю от сердца. А где блок питания? Почему в таком ужасном состоянии?"
  }],
  "createdDate": "2022-2-25 3:17:2",
  "category": ["Программирование"]
}, {
  "id": "oHfTeu",
  "title": "Учим HTML и CSS",
  "announce": "Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?",
  "fullText": "Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция.",
  "comments": [{
    "id": "7kCDm6",
    "text": "Неплохо, но дорого. Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-29 7:47:6",
  "category": ["Кино"]
}];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData});

  const app = express();
  app.use(express.json());
  const cloneData = JSON.parse(JSON.stringify(mockData));

  articles(app, new DataService(cloneData), new CommentService(cloneData));
  return app;
};



describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's title equals "Куплю антиквариат"`, () => expect(response.body[0].title).toBe(`Что такое золотое сечение`));
});

describe(`API returns an articles with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Что такое золотое сечение"`, () => expect(response.body.title).toBe(`Что такое золотое сечение`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": "Новая публикация",
    "announce": "Текст публикации",
    "fullText": "Текст публикации полный",
    "createdDate": "2022-2-26 22:43:20",
    "category": [
      "Без рубрики"
    ]};

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an articles if data is invalid`, () => {
  const newArticles = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticles)) {
      const badOffer = {...newArticles};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newOffer =
    {
      "title": "Новая публикация",
      "announce": "Текст публикации",
      "fullText": "Текст публикации полный",
      "createdDate": "2022-2-26 22:43:20",
      "category": [
        "Без рубрики"
      ]
    };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/oHfTeu`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () => request(app)
    .get(`/articles/oHfTeu`)
    .expect((res) => expect(res.body.title).toBe(`Новая публикация`))
  );
});

test(`API returns status code 404 when trying to change non-existent articles`, async () => {
  const app = await createAPI();

  const validOffer = {
    "title": "Новая публикация2",
    "announce": "Текст публикации2",
    "fullText": "Текст публикации полный2",
    "createdDate": "2022-2-26 22:43:20",
    "category": [
      "Без рубрики2"
    ]
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an articles with invalid data`, async () => {
  const app = await createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an articles`, () => {

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/aYnqTV`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`aYnqTV`));

  test(`Articles count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to delete non-existent articles`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`Status code 200 article comments`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/caenj9/comments/`)
    .expect(HttpCode.OK);
});

test(`Status code 404 not found article comments`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/caenj/comments/`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/aYnqTV/comments/dfgfgd`)
    .expect(HttpCode.NOT_FOUND);
});
