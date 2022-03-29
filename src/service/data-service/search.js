'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    const offer = this._offers.filter((item) => item.title == searchText);
    console.log(offer);

    // if (!offer || offer === undefined) {
    //   return [];
    // }

    return offer;
  }
}

module.exports = SearchService;
