// App.js
import React from 'react';
import SideNav from './Components/SideNav';
import vite from "FrontEnd\RMKEC\src\assets\react.svg"
function App() {
  return (
    <div style={{ display: 'flex' }}>
      <SideNav/>
      <main style={{ marginLeft: '240px', padding: '20px', flex: 1 }}>
        <h1>Welcome to the Dashboard</h1>
      </main>
    </div>
  );
}

export default App;
