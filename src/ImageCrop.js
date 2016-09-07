import React, {Component} from 'react';


/**
 * `ImageCrop` is a presentational component for cropping.  It shows a
 * representation of the image croped with a given `scale` and clip represented
 * by a `x` and `y` offset as well as a `width` and a `height`.
 */
class ImageCrop extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Lifecycle hooks.
   */

  componentDidMount() {
    this.refs.image.onload = () => {
      let {naturalWidth, naturalHeight} = this.refs.image;
      let {width, height} = this.props.crop;
      let {onImageLoad} = this.props;
      this.setState({
        widthRatio: naturalWidth / width,
        heightRatio: naturalHeight / height,
      });
      if (onImageLoad) onImageLoad(this.refs.image, this.refs.window);
    };
  }

  /**
   * Renderer.
   */

  render() {
    return (
      <div
        className='image-crop-window'
        ref='window'
        style={this.getWindowStyle()}
      >
        <div
          className='image-crop-canvas'
          ref='canvas'
          style={this.getCanvasStyles()}
        >
          <img
            alt={this.props.alt}
            className='image-crop-image'
            ref='image'
            src={this.props.src}
            style={this.getImageStyles()}
          />
        </div>
        {
          this.props.showOverlay && (
            <div className='image-crop-overlay'>
              <i className='fa fa-crop' aria-hidden='true' />
            </div>
          )
        }
      </div>
    );
  }

  /**
   * Selectors, for props.
   */

  getWindowStyle() {
    return {
      paddingTop: this._toPercent(this.props.crop.height / this.props.crop.width),
      // Why bother with a stylesheet at this point.
      position: 'relative',
      display: 'block',
      overflow: 'hidden',
      cursor: 'move',
    };
  }

  getCanvasStyles() {
    let { widthRatio, heightRatio, } = this.state;
    let { width, height, x = 0, y = 0, scale = 1, } = this.props.crop;
    return {
      width: this._toPercent(widthRatio * scale),
      height: this._toPercent(heightRatio * scale),
      left: this._toPercent(- x / width),
      top: this._toPercent(- y / height),
      // Why bother with a stylesheet at this point.
      position: 'absolute',
      textAlign: 'center',
      margin: '0 !important',
      padding: '0 !important',
      border: 'none !important',
    };
  }

  getImageStyles() {
    return {
      width: '100%',
      height: '100%',
      top: '10%',
      left: '10%',
      perspective: '1000px',
      backfaceVisibility: 'hidden',
      visibility: 'visible',
    }
  }

  /**
   * Helpers, these are used all over the place.
   */
  _toPercent(ratio) {
    return `${ratio * 100}%`;
  }
}


ImageCrop.propTypes = {
  /**
   * `src`: The image source url.
   */
  src: React.PropTypes.string.isRequired,
  /**
   * `alt`: The image alternative text.
   */
  alt: React.PropTypes.string.isRequired,
  /**
   * `crop`: describes the way the image should be cropped.
   */
  crop: React.PropTypes.shape({
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }).isRequired,
  /**
   * `onImageLoad`: A callback to call when the image is actually loaded to the
   * screen, it should take the loaded image element and the crop window
   * element as parameters.
   */
  onImageLoad: React.PropTypes.func,
  /**
   * `showOverlay`: A boolean flag to enable a little overlay on the botom of the
   * image. Requires font awesome.
   */
  showOverlay: React.PropTypes.bool,
}

export default ImageCrop;

