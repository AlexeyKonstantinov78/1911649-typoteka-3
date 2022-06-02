'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const {getLogger} = require(`../../service/lib/logger`);
const logger = getLogger({name: `api http offers-routes`});

// Определяем `GET` маршруты.
// В качестве ответа отправляем путь маршрута.
// Следует помнить, что в первом параметре мы указываем путь маршрута
// без `articles`, т.к. уже указали при подключении модуля маршрута
// в `express.js`.
const getAddOfferData = () => {
  return api.getCategories();
};

const getEditOfferData = async (offerId) => {
  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(offerId),
      api.getCategories()
    ]);
    return [offer, categories];
  } catch (error) {
    const error = err.message;
    logger.info(error);
    res.render(`./post/post-edit`, {error});
  }
};

const getViewOfferData = ({id}) => {
  return api.getOffer({id, withComments: true});
};

offersRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);

  res.render(`./post/post-edit`, {id, offer, categories});
});

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    title: body.title,
    announce: body.announcement,
    fullText: body.fullText,
    createdDate: body.date,
    category: ensureArray(body.category),
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [offer, categories] = await getEditOfferData(id);
    res.render(`./post/post-edit`, {id, offer, categories, validationMessages});
  }
});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await getAddOfferData();

  res.render(`./post/post`, {categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await getViewOfferData(id, true);
  res.render(`./post/post-detail`, {offer, id});
});

offersRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/offers/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewOfferData(id, true);
    res.render(`./post/post-detail`, {offer, id, validationMessages});
  }
});

offersRouter.post(`/add`,
  upload.single(`avatar`), // применяем middleware
  async (req, res) => {

  //  в `body` содержатся текстовые данные формы
  // в `file` — данные о сохранённом файле

    // const {body, file} = req;
    const {body, file} = req;

    console.log(body);

      const offerData = {
        title: body.title,
        announce: body.announcement,
        fullText: body.fullText,
        createdDate: body.date,
        category: ensureArray(body.category),
      };

      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddOfferData();

        res.render(`./post/post`, {categories, validationMessages});
      }
  }
);

module.exports = offersRouter;
