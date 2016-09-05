import React, { Component } from 'react';
import './App.css';

import Guillotine from './Guillotine.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Guillotine
          src='http://placehold.it/600x600'
          width={300}
          height={250}
          alt="Something"
        />
        <Guillotine
          src='http://fillmurray.com/600/300'
          width={300}
          height={250}
          alt="Narrow"
        />
      </div>
    );
  }
}

export default App;
