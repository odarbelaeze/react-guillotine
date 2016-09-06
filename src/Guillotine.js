import React, {Component} from 'react';
import './Guillotine.css';
import _ from 'lodash';
import ImageCrop from './ImageCrop';


class Guillotine extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.boundWheel = this.handleWheel.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundInitImage = this.initImage.bind(this);
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
    let {crop} = this.refs;
    _.each(this.localEvents(), (listener, event) => {
      crop.refs.window.addEventListener(event, listener);
    });
    _.each(this.globalEvents(), (listener, event) => {
      window.addEventListener(event, listener);
    });
  }

  componentWillUnmount() {
    let crop = this.refs;
    _.each(this.localEvents, (listener, event) => {
      crop.refs.window.removeEventListener(event, listener);
    });
    _.each(this.globalEvents(), (listener, event) => {
      window.removeEventListener(event, listener);
    });
  }

  componentWillReceiveProps() {
    this.setState(this.props.data);
  }

  render() {
    return (
      <ImageCrop
        crop={this.getCrop()}
        onImageLoad={this.boundInitImage}
        ref='crop'
        {...this.props}
      />
    );
  }

  initImage(image, cropWindow) {
    let { naturalWidth, naturalHeight } = image;
    let { width, height } = this.props;
    let minWidthScale = width / naturalWidth;
    let minHeightScale = height / naturalHeight;
    let minScale = minWidthScale > minHeightScale? minWidthScale : minHeightScale;
    this.setState({
      minScale,
      naturalWidth,
      naturalHeight,
      clientScale: width / cropWindow.clientWidth,
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
    this.setState(this.newScale(1.0 / 1.05));
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

  getCrop() {
    return {
      scale: this.state.scale,
      x: this.state.x,
      y: this.state.y,
      width: this.props.width,
      height: this.props.height,
    }
  }

  report() {
    if (this.props.onChange) {
      this.props.onChange(this.props.getCrop());
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
