import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.profileImgs = [];
    this.totalCharacters = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
  }


  onGetGiphySuccess(payload) {
    console.log(payload);
    this.profileImgs = payload.data;
  }

  onGetGiphyFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 500);
    toastr.error(payload.responseText);
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onReRenderPage() {
    this.profileImgs = [];
    this.searchQuery = "";
  }
}

export default alt.createStore(NavbarStore);
