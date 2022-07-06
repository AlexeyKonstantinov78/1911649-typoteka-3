'use strict';

// Подключаем и инициализируем экземпляр Router
const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const {getLogger} = require(`../../service/lib/logger`);
const logger = getLogger({name: `api http offers-routes`});

const csrf = require(`csurf`);
const csrfProtection = csrf();

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
  } catch (err) {
    const error = err.message;
    logger.info(error);
    res.render(`./post/post-edit`, {error});
  }
};

const getViewOfferData = ({id}) => {
  return api.getOffer({id, withComments: true});
};

offersRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));

offersRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);

  res.render(`./post/post-edit`, {id, offer, categories, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    title: body.title,
    announce: body.announcement,
    fullText: body.fullText,
    picture: file ? file.filename : ``,
    createdDate: body.date,
    category: ensureArray(body.category),
    userId: user.id,
  };

  try {
    await api.editOffer(id, offerData, user);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [offer, categories] = await getEditOfferData(id);
    res.render(`./post/post-edit`, {id, offer, categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

offersRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddOfferData();

  res.render(`./post/post`, {categories, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const offerData = {
    title: body.title,
    announce: body.announcement,
    fullText: body.fullText,
    picture: file ? file.filename : ``,
    createdDate: body.date,
    category: ensureArray(body.category),
    userId: user.id,
  };

  try {
    await api.createOffer({data: offerData});
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddOfferData();

    res.render(`./post/post`, {categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

offersRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const offer = await getViewOfferData(id, true);
  res.render(`./post/post-detail`, {offer, id, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/offers/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewOfferData(id, true);
    res.render(`./post/post-detail`, {offer, id, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

offersRouter.post(`/add`, auth, upload.single(`avatar`), async (req, res) => {

  //  в `body` содержатся текстовые данные формы
  // в `file` — данные о сохранённом файле

    // const {body, file} = req;
    const {body, file} = req;
    const {user} = req.session;

      const offerData = {
        title: body.title,
        announce: body.announcement,
        fullText: body.fullText,
        createdDate: body.date,
        category: ensureArray(body.category),
        userId: user.id,
      };

      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddOfferData();

        res.render(`./post/post`, {categories, validationMessages, userId});
      }
  }
);

module.exports = offersRouter;
