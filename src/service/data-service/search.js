'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    const offer = this._offers.find((item) => item.title.includes(searchText));

    if (!offer || offer === undefined) {
      return {};
    }

    return [offer];
  }
}

module.exports = SearchService;
