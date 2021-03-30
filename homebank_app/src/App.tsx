import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'tailwindcss/dist/tailwind.css'
import Main from './ui/Main'
import AppHeader from './AppHeader'

function App() {
  return (
    <div className="App">
      <AppHeader/>
      <Main/>
    </div>
  );
}

export default App;
