import alt from '../alt';
import ImageTagActions from '../actions/ImageTagActions';

class ImageTagStore {
  constructor() {
    this.bindActions(ImageTagActions);
    this.loaded = false;
  }

}

export default alt.createStore(ImageTagStore);
