'use strict';

const axios = require(`axios`);
const {getLogger} = require(`../service/lib/logger`);
const logger = getLogger({name: `api http`});
const {HttpMethod} = require(`../../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    logger.info(url);
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getOffer(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  editOffer(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async createOffer(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
