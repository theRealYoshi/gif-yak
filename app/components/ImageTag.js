import React from 'react';
import {Link} from 'react-router';
import ImageTagStore from '../stores/ImageTagStore';
import ImageTagActions from '../actions/ImageTagActions';

class ImageTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = ImageTagStore.getState();
  }

  _onImageLoad() {
    console.log(this);
    if (this.isMounted()) {
      this.setState({loaded: true});
    }
  }

  componentDidMount() {
    var imgTag = this.refs.img.getDOMNode();
    var imgSrc = imgTag.getAttribute('src');
    var img = new window.Image();
    img.onload = this._onImageLoad;
    img.src = imgSrc;
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
