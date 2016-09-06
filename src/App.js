import React, { Component } from 'react';
import './App.css';

import Guillotine from './Guillotine.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='react-guillotine-holder' style={{width: 150, height: 125}}>
          <Guillotine
            src='http://placehold.it/600x600'
            width={300}
            height={250}
            alt="Something"
          />
        </div>
        <div className='react-guillotine-holder' style={{width: 500, height: 800}}>
          <Guillotine
            src='http://fillmurray.com/600/300'
            width={250}
            height={400}
            alt="Narrow"
          />
        </div>
      </div>
    );
  }
}

export default App;
