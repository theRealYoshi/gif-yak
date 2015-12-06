import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'getGiphySuccess',
      'getGiphyFail',
      'getCharacterCountSuccess',
      'getCharacterCountFail',
      'findCharacterSuccess',
      'findCharacterFail'
    );
  }
  //find images based off Giphy or Redis
  findGif(payload){
    $.ajax({
      url: '/api/gifs/search', // change this
      data: { email: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.getGiphySuccess(payload);
      })
      .fail(() => {
        this.actions.getGiphyFail(payload);
      });
  }

  findCharacter(payload) {
    $.ajax({
      url: '/api/characters/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findCharacterSuccess(payload);
      })
      .fail(() => {
        this.actions.findCharacterFail(payload);
      });
  }

  getCharacterCount() {
    $.ajax({ url: '/api/characters/count' })
      .done((data) => {
        this.actions.getCharacterCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getCharacterCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NavbarActions);
