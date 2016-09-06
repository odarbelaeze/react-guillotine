import React, {Component} from 'react';
import './Guillotine.css';
import _ from 'lodash';


class Guillotine extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.boundWheel = this.handleWheel.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
  }

  localEvents() {
    return {
      wheel: this.boundWheel,
      mousedown: this.boundMouseDown,
      touchstart: this.boundMouseDown,
    }
  }

  globalEvents() {
    return {
      mousemove: this.boundMouseMove,
      touchmove: this.boundMouseMove,
      touchend: this.boundMouseUp,
      mouseup: this.boundMouseUp,
    }
  }

  componentDidMount() {
    this.refs.image.onload = this.initImage.bind(this);
    _.each(this.localEvents(), (listener, event) => {
      this.refs.window.addEventListener(event, listener);
    });
    _.each(this.globalEvents(), (listener, event) => {
      window.addEventListener(event, listener);
    });
  }

  componentWillUnmount() {
    _.each(this.localEvents, (listener, event) => {
      this.refs.window.removeEventListener(event, listener);
    });
    _.each(this.globalEvents(), (listener, event) => {
      window.removeEventListener(event, listener);
    });
  }

  componentWillReceiveProps() {
    this.setState(this.props.data);
  }

  render() {
    let {src, width, height, alt} = this.props;
    return (
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
    );
  }

  initImage() {
    let { naturalWidth, naturalHeight } = this.refs.image;
    let { width, height } = this.props;
    let minWidthScale = width / naturalWidth;
    let minHeightScale = height / naturalHeight;
    let minScale = minWidthScale > minHeightScale? minWidthScale : minHeightScale;
    console.log(this.refs.window.clientWidth);
    this.setState({
      minScale,
      naturalWidth,
      naturalHeight,
      widthRatio: naturalWidth / width,
      heightRatio: naturalHeight / height,
      clientScale: width / this.refs.window.clientWidth,
      scale: minScale,
      maxX: naturalWidth * minScale - this.props.width,
      maxY: naturalHeight * minScale - this.props.height,
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

  pan(dx, dy) {
    let scaledDx = dx * this.state.clientScale;
    let scaledDy = dy * this.state.clientScale;
    this.setState({
      x: this._clip(this.state.x + scaledDx, 0, this.state.maxX),
      y: this._clip(this.state.y + scaledDy, 0, this.state.maxY),
    });
    this.report();
  }

  zoomIn() {
    this.setState(this.newScale(1.05));
    this.report();
  }

  zoomOut() {
    this.setState(this.newScale(0.95));
    this.report();
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
      this.pan(
        this.state.panningFrom.clientX - evt.clientX,
        this.state.panningFrom.clientY - evt.clientY,
      )
      this.setState({ panningFrom: evt });
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

  report() {
    if (this.props.onChange) {
      this.props.onChange({
        scale: this.state.scale,
        x: this.state.x,
        y: this.state.y,
        width: this.props.width,
        height: this.props.height,
      });
    }
  }

  /**
   * Helpers
   */
  _clip(val, min = null, max = null) {
    if ((min !== null) && (min === max)) return min;
    if ((min !== null) && (val < min)) return min;
    if ((max !== null) && (val > max)) return max;
    return val;
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
  /**
   * `onChange`: this callback will be called after each zoom or pan action.
   */
  onChange: React.PropTypes.func,
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
