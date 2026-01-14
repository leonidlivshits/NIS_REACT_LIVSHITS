import React from 'react';
import MessageNotification from './components/MessageNotification';
import './App.module.css';

function App() {
  return (
    <div className="App">
      <header style={{
        padding: '20px',
        backgroundColor: '#282c34',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Демо локализации</h1>
      </header>
      
      <main style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <MessageNotification />
      </main>
    </div>
  );
}

export default App;