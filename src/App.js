import React, { Component } from 'react';
import './App.css';

import Guillotine from './Guillotine.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='react-guillotine-holder' style={{width: 150, height: 125}}>
          <Guillotine
            src='http://placekitten.com/600/600'
            width={300}
            height={250}
            alt="Something"
          />
        </div>
        <div className='react-guillotine-holder' style={{width: 500, height: 800}}>
          <Guillotine
            src='http://lorempixel.com/1920/1080'
            width={250}
            height={400}
            alt="Narrow"
          />
        </div>
        <div className='react-guillotine-holder' style={{width: 300, height: 300}}>
          <Guillotine
            src='http://fillmurray.com/1300/1000'
            width={600}
            height={600}
            alt="Square"
          />
        </div>
      </div>
    );
  }
}

export default App;
