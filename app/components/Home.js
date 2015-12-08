import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
    HomeStore.listen(this.onChange);
    HomeActions.getTwoCharacters();
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
    HomeStore.unlisten(this.onChange);
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
        <h3 className='text-center'>Input an email. Click on a Gif.</h3>
        <div className='row'>
          <img src='http://res.cloudinary.com/dts9d9zod/image/fetch/f_auto,w_300,h_300,c_fill/http://media0.giphy.com/media/26tPrnVRNlPY5lQIw/200.gif' height='300'/>
        </div>
      </div>
    );
  }
}

export default Home;
