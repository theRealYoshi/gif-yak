import React from 'react';
import {Link} from 'react-router';
import ImageTagStore from '../stores/ImageTagStore';
import ImageTagActions from '../actions/ImageTagActions';

class ImageTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = ImageTagStore.getState();
  }

  render() {
    var className = this.props.className ? this.props.className + ' image' : 'image';
    return React.createElement('img', Object.assign({}, this.props, {
      ref: 'img',
      className: className
    }));
  }

}

export default ImageTag;
