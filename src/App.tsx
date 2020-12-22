import React from 'react';
import './App.css';
import { StopwatchService } from './components/services/stopwatchService';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <StopwatchService />
      </header>
    </div>
  );
}

export default App;
