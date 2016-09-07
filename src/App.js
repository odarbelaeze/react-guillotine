import React, { Component } from 'react';
import './App.css';

import Guillotine from './Guillotine.js';
import ImageCropper from './ImageCropper.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='react-guillotine-holder' style={{width: 150, height: 125}}>
          <Guillotine
            src='http://placekitten.com/600/600'
            crop={{ width: 300, height: 250, }}
            alt="Something"
          />
        </div>
        <div className='react-guillotine-holder' style={{width: 500, height: 800}}>
          <ImageCropper
            src='http://beerhold.it/800/600'
            crop={{ width: 250, height: 400, scale: 3, }}
            alt="Narrow"
            onUpdateCrop={console.log}
            onStartCrop={_ => console.log('start crop')}
            onEndCrop={_ => console.log('end crop')}
          />
        </div>
        <div className='react-guillotine-holder' style={{width: 300, height: 300}}>
          <ImageCropper
            src='http://fillmurray.com/1300/1000'
            crop={{ width: 600, height: 600, }}
            alt="Square"
            onUpdateCrop={console.log}
            onStartCrop={_ => console.log('start crop')}
            onEndCrop={_ => console.log('end crop')}
            isCropping
          />
        </div>
      </div>
    );
  }
}

export default App;
