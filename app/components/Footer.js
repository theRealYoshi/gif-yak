import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12'>
              <p>Powered by <strong>Node.js</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
