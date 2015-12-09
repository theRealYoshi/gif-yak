import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import NavbarStore from '../stores/NavbarStore';
import HomeActions from '../actions/HomeActions';
import ImageTag from './ImageTag';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(character) {
    var winner = character.characterId;
    var loser = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
    HomeActions.vote(winner, loser);
  }

  render() {
    var profileImgs = this.state.profileImgs.map((imgSrc, idx) => {
      return (
        <div className='row flipInX animated'>
          <ImageTag src={imgSrc} />
        </div>
      );
    });
    var header;
    if (this.state.profileImgs.length > 0){
      header = <div></div>;
    } else {
      header = <h3 className='text-center'>Search for an Email. Through Gifs.</h3>;
    }

    return (
      <div className='container'>
        {header}
        <div className='row'>
          {profileImgs}
        </div>
      </div>
    );
  }
}

export default Home;
