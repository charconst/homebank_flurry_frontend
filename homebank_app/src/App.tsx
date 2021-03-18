import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'tailwindcss/dist/tailwind.css'

function App() {
  return (
    <div className="App">
      <div className="p-6 max-w-sm mx-auto bg-yellow-400 rounded-xl shadow-md flex items-center space-x-4"></div>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
