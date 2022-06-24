'use strict';

const express = require(`express`);
const request = require(`supertest`);

const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);

const mockDB = require(`../lib/mock-db`);

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
  "title": "Рок — это протест",
  "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.",
  "fullText": "Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина.",
  "comments": [{
    "text": "С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?"
  }, {
    "text": "Совсем немного..."
  }, {
    "text": "А сколько игр в комплекте? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-27 3:0:25",
  "categories": ["Деревья"]
}, {
  "title": "Самый лучший музыкальный альбом этого года",
  "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
  "fullText": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов.",
  "comments": [{
    "text": "Вы что?! В магазине дешевле. Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?"
  }, {
    "text": "Продаю в связи с переездом. Отрываю от сердца."
  }, {
    "text": "Почему в таком ужасном состоянии? А сколько игр в комплекте?"
  }],
  "createdDate": "2022-2-26 22:43:20",
  "categories": ["Без рамки"]
}, {
  "title": "Как достигнуть успеха не вставая с кресла",
  "announce": "Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха.` Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят.",
  "comments": [{
    "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А сколько игр в комплекте?"
  }, {
    "text": "А сколько игр в комплекте? Неплохо, но дорого. Совсем немного..."
  }, {
    "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-19 23:23:3",
  "categories": ["Без рамки"]
}, {
  "title": "Борьба с прокрастинацией",
  "announce": "Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят.",
  "comments": [{
    "text": "Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?"
  }, {
    "text": "Оплата наличными или перевод на карту? А сколько игр в комплекте?"
  }, {
    "text": "Совсем немного... А где блок питания? Вы что?! В магазине дешевле."
  }],
  "createdDate": "2022-2-22 16:35:5",
  "categories": ["Кино"]
}, {
  "title": "Учим HTML и CSS",
  "announce": "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.",
  "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
  "comments": [{
    "text": "Оплата наличными или перевод на карту?"
  }],
  "createdDate": "2022-2-27 2:27:25",
  "categories": ["Деревья"]
}, {
  "title": "Борьба с прокрастинацией",
  "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.",
  "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой.",
  "comments": [{
    "text": "С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-20 6:6:27",
  "categories": ["Программирование"]
}, {
  "title": "Ёлки. История деревьев",
  "announce": "Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
  "fullText": "Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.",
  "comments": [{
    "text": "Неплохо, но дорого. А сколько игр в комплекте? Совсем немного..."
  }, {
    "text": "С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Неплохо, но дорого."
  }],
  "createdDate": "2022-2-27 0:4:7",
  "categories": ["Без рамки"]
}, {
  "title": "Как собрать камни бесконечности",
  "announce": "Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха.` Как начать действовать? Для начала просто соберитесь.",
  "fullText": "Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина.",
  "categories": [{
    "text": "Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?"
  }, {
    "text": "С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-21 21:52:11",
  "categories": ["За жизнь"]
}, {
  "title": "Как начать программировать",
  "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`",
  "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой.",
  "comments": [{
    "text": "А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого."
  }],
  "createdDate": "2022-2-23 23:15:35",
  "categories": ["Железо"]
}, {
  "title": "Борьба с прокрастинацией",
  "announce": "Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят.",
  "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция.",
  "comments": [{
    "text": "Неплохо, но дорого."
  }, {
    "text": "Вы что?! В магазине дешевле."
  }, {
    "text": "Неплохо, но дорого. С чем связана продажа? Почему так дешёво?"
  }],
  "createdDate": "2022-2-21 20:46:10",
  "categories": ["IT"]
}];

const createAPI = async () => {

  await initDB(mockDB, {articles: mockData, categories: mockCategories});

  const app = express();
  app.use(express.json());

  articles(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {

  test(`Status code 200`, async () => {
    const app = await createAPI();
    const response = await request(app).get(`/articles`);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns a list of 10 offers`, async () => {
    const app = await createAPI();
    const response = await request(app).get(`/articles`);
    expect(response.body.length).toBe(10);
  });

  test(`First offer's title equals "Борьба с прокрастинацией"`, async () => {
    const app = await createAPI();
    const response = await request(app).get(`/articles`);
    expect(response.body[0].title).toBe(`Борьба с прокрастинацией`);
  });

  test(`When field type is wrong response code is 400`, async () => {
    const app = await createAPI();
    const badOffers = [
      {...mockData, picture: 12345},
      {...mockData, categories: `Котики`}
    ];
    for await (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const app = await createAPI();
    const badOffers = [
      {...mockData, title: `too short`},
      {...mockData, categories: []}
    ];
    for await (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API returns an articles with given id`, () => {

  test(`Status code 200`, async () => {
    const app = await createAPI();
    const response = await request(app).get(`/articles/1`);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Offer's title is "Рок — это протест"`, async () => {
    const app = await createAPI();
    const response = await request(app).get(`/articles/1`);
    expect(response.body.title).toBe(`Рок — это протест`);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": "Новая публикация",
    "announce": "Текст публикации Должен быть 30",
    "fullText": "Текст публикации полный",
    "categories": [7]
  };

  test(`Status code 201`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .post(`/articles`)
      .send(newArticle);
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Articles count is changed`, async () => {
    const app = await createAPI();

    return await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(10));
  });
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

  test(`Without any required property response code is 400`, async () => {
    const app = await createAPI();
    for await (const key of Object.keys(newArticles)) {
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
      "announce": "Текст публикации больше 30 символов",
      "fullText": "Текст публикации полный",
      "picture": "non",
      "categories": [
        7
      ]
    };

  test(`Status code 200`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .put(`/articles/10`)
      .send(newOffer);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Offer is really changed`, async () => {
    const app = await createAPI();
    await request(app)
      .put(`/articles/10`)
      .send(newOffer);

    await request(app)
      .get(`/articles/10`)
      .expect((res) => expect(res.body.title).toBe(`Новая публикация`));
  });
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

  return await request(app)
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

  return await request(app)
    .put(`/articles/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an articles`, () => {

  test(`Status code 200`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .delete(`/articles/1`);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns deleted offer`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .delete(`/articles/1`);
    expect(response.body.id).toBe(`1`);
  });

  test(`Articles count is 10 now`, async () => {
    const app = await createAPI();
    return await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(10));
  });
});

test(`API refuses to delete non-existent articles`, async () => {
  const app = await createAPI();

  return await request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`Status code 200 article comments`, async () => {
  const app = await createAPI();

  return await request(app)
    .get(`/articles/caenj9/comments/`)
    .expect(HttpCode.OK);
});

test(`Status code 404 not found article comments`, async () => {
  const app = await createAPI();

  return await request(app)
    .get(`/articles/caenj/comments/`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return await request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return await request(app)
    .delete(`/articles/1/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
