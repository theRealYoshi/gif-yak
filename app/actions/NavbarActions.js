import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'getGiphySuccess',
      'getGiphyFail'
    );
  }
  //find images based off Giphy or Redis
  findGif(payload){
    console.log("sending" + payload);
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

}

export default alt.createActions(NavbarActions);
