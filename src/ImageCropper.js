import React, {Component} from 'react';

import Guillotine from './Guillotine';
import ImageCrop from './ImageCrop';


/**
 * An image cropper that cycles between a guillotine and a simple
 * image crop.
 */
class ImageCropper extends Component {

  constructor(props) {
    super(props);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
  }
  componentDidMount() {
    let {isCropping} = this.props;
    if (isCropping) {
      window.addEventListener('keydown', this.boundKeyDown);
      window.addEventListener('mousedown', this.boundMouseDown);
    }
  }

  componentWillUnmount() {
    let {isCropping} = this.props;
    if (isCropping) {
      window.removeEventListener('keydown', this.boundKeyDown);
      window.removeEventListener('mousedown', this.boundMouseDown);
    }
  }

  render() {
    let {src, alt, crop, isCropping, onUpdateCrop, onStartCrop} = this.props;
    let childProps = {src, alt, crop};
    if (isCropping) {
      return (
        <div ref='cropper' className='react-image-cropper-guillotine'>
          <Guillotine {...childProps} onChange={onUpdateCrop} showCropControls />
        </div>
      );
    }
    return (
      <div className='react-image-cropper-image-crop' onClick={onStartCrop} >
        <ImageCrop {...childProps} showOverlay />
      </div>
    );
  }

  handleKeyDown(evt) {
    if (evt.key === 'Enter') this.props.onEndCrop();
  }

  handleMouseDown(evt) {
    if (!this.refs.cropper.contains(evt.target)) this.props.onEndCrop();
  }

}

ImageCropper.propTypes = {
   /**
   * `src`: The image source url.
   */
  src: React.PropTypes.string.isRequired,
  /**
   * `alt`: The image alternative text.
   */
  alt: React.PropTypes.string.isRequired,
  /**
   * `crop`: describes the way the image should be cropped. If zooming/pannig
   * parameters are provided, then they'll be used as defaults.
   */
  crop: React.PropTypes.shape({
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }).isRequired,
  /**
   * `onUpdateCrop`: this callback will be called after each zoom or pan action.
   */
  onUpdateCrop: React.PropTypes.func.isRequired,
  /**
   * `onStartCrop`: This will be called when the user signals to start cropping
   * here.
   */
  onStartCrop: React.PropTypes.func.isRequired,
  /**
   * `onEndCrop`: This will be calle when the user signals to end cropping
   * here.
   */
  onEndCrop: React.PropTypes.func.isRequired,
  /**
   * `isCropping`: this flag indicates if the component is currently cropping.
   */
  isCropping: React.PropTypes.bool,
}

ImageCropper.defaultProps = {
  isCropping: false,
}

export default ImageCropper;
