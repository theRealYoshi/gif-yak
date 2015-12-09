import alt from '../alt';
import ImageTagActions from '../actions/ImageTagActions';

class ImageTagStore {
  constructor() {
    this.bindActions(ImageTagActions);
    this.loaded = false;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }
}

export default alt.createStore(ImageTagStore);
