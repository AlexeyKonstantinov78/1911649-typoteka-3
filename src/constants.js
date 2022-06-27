'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;
const API_PREFIX = `/api`;
const OFFERS_PER_PAGE = 8;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
}

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Описание содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Описание не может содержать более 1000 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  FULL_TEXT_MAX: `публикация не может содержать более 1000 символов`
};

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  HttpCode,
  ErrorCommentMessage,
  MAX_ID_LENGTH,
  API_PREFIX,
  OFFERS_PER_PAGE,
  Env,
  ErrorArticleMessage,
  ErrorRegisterMessage,
  ErrorAuthMessage,
  HttpMethod
};
