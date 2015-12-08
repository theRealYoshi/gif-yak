import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import NavbarStore from '../stores/NavbarStore';
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 2000);
    });
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
          <img src={imgSrc} />
        </div>
      );
    });
    var header;
    if (this.state.profileImgs.length > 0){
      header = <div></div>;
    } else {
      header = <h3 className='text-center'>Input an email. Click on a Gif.</h3>;
    }
    // var characterNodes = this.state.characters.map((character, index) => {
    //   return (
    //     <div key={character.characterId} className={index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5'}>
    //       <div className='thumbnail fadeInUp animated'>
    //         <img onClick={this.handleClick.bind(this, character)} src={'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg'}/>
    //         <div className='caption text-center'>
    //           <ul className='list-inline'>
    //             <li><strong>Race:</strong> {character.race}</li>
    //             <li><strong>Bloodline:</strong> {character.bloodline}</li>
    //           </ul>
    //           <h4>
    //             <Link to={'/characters/' + character.characterId}><strong>{character.name}</strong></Link>
    //           </h4>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // });
    //      {characterNodes} add this in the div for rows

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
