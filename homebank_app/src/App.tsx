import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'tailwindcss/dist/tailwind.css'
import AppHeader from './AppHeader'

function App() {
  return (
    <div className="App">
      {AppHeader()}
    </div>
  );
}

export default App;
