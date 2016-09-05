import React, {Component} from 'react';
import './Guillotine.css';
import _ from 'lodash';


class Guillotine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
    };
    this.boundWheel = this.handleWheel.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
  }

  getEvents() {
    return {
      wheel: this.boundWheel,
      mousedown: this.boundMouseDown,
      touchstart: this.boundMouseDown,
      mousemove: this.boundMouseMove,
      touchmove: this.boundMouseMove,
      touchend: this.boundMouseUp,
      mouseup: this.boundMouseUp,
    }
  }

  componentDidMount() {
    this.refs.image.onload = this.initImage.bind(this);
    _.each(this.getEvents(), (listener, event) => {
      this.refs.window.addEventListener(event, listener);
    });
  }

  componentWillUnmount() {
    _.each(this.getEvents, (listener, event) => {
      this.refs.window.removeEventListener(event, listener);
    });
  }

  componentWillReceiveProps() {
    this.setState(this.props.data);
  }

  render() {
    let {src, width, height, alt} = this.props;
    return (
      <div className='react-guillotine-holder' style={{width, height}}>
        <div
          className='react-guillotine-window'
          style={{paddingTop: (height/width*100) + '%'}}
          ref='window'
        >
          <div
            className='react-guillotine-canvas'
            style={this.getCanvasStyles()}
          >
            <img
              ref='image'
              src={src}
              alt={alt}
              style={this.getImgStyles()}
            />
          </div>
        </div>
      </div>
    );
  }

  initImage() {
    let { naturalWidth, naturalHeight } = this.refs.image;
    let { width, height } = this.props;
    let minWidthScale = width / naturalWidth;
    let minHeightScale = height / naturalHeight;
    let minScale = minWidthScale > minHeightScale? minWidthScale : minHeightScale;
    this.setState({
      minScale,
      naturalWidth,
      naturalHeight,
      widthRatio: naturalWidth / width,
      heightRatio: naturalHeight / height,
      scale: minScale,
      x: 0.5 * (naturalWidth * minScale - width),
      y: 0.5 * (naturalHeight * minScale - height),
    });
  }

  newScale(factor) {
    let {minScale} = this.state;
    let scale = this._clip(this.state.scale * factor, minScale);
    let maxX = this.state.naturalWidth * scale - this.props.width;
    let maxY = this.state.naturalHeight * scale - this.props.height;
    let x = this._clip(
      this.state.x + this.state.naturalWidth * (scale - this.state.scale) / 2,
      0,
      maxX
    );
    let y = this._clip(
      this.state.y + this.state.naturalHeight * (scale - this.state.scale) / 2,
      0,
      maxY
    );
    return { scale, maxX, maxY, x, y, };
  }

  zoomIn() {
    this.setState(this.newScale(1.05));
  }

  zoomOut() {
    this.setState(this.newScale(0.95));
  }

  handleWheel(evt) {
    evt.preventDefault();
    if (Math.abs(evt.deltaY) < 1) return;
    if (evt.deltaY < 0) this.zoomOut();
    if (evt.deltaY > 0) this.zoomIn();
  }

  handleMouseDown(evt) {
    evt.preventDefault();
    this.setState({ panning: true, panningFrom: evt });
  }

  handleMouseMove(evt) {
    if (this.state.panning) {
      evt.preventDefault();
      console.log(evt);
    }
  }

  handleMouseUp(evt) {
    evt.preventDefault();
    this.setState({ panning: false, panningFrom: null });
  }

  getCanvasStyles() {
    return {
      width: `${this.state.widthRatio * this.state.scale * 100}%`,
      height: `${this.state.heightRatio * this.state.scale * 100}%`,
      top:  `${- this.state.y / this.props.height * 100}%`,
      left: `${- this.state.x / this.props.width * 100}%`,
    };
  }

  getImgStyles() {
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
   * Helpers
   */
  _clip(val, min = null, max = null) {
    let newVal = val;
    if (min) newVal = newVal > min? newVal : min;
    if (max) newVal = newVal < max? newVal : max;
    return newVal;
  }
}

Guillotine.propTypes = {
  src: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  alt: React.PropTypes.string.isRequired,
  data: React.PropTypes.shape({
    scale: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }),
}

Guillotine.defaultProps = {
  data: {
    scale: 1,
    x: 0,
    y: 0,
    width: 0,
    hight: 0,
  },
}

export default Guillotine;
