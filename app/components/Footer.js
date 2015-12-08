import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-8'>
              <p>Powered by <strong>Node.js</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
            </div>
            <div className='col-sm-4'>
              <ul className='list-inline'>
                <li><Link to='/add'>Github</Link></li>
                <li><Link to='/add'>Linkedin</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
