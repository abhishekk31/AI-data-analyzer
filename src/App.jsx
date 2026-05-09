import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Fileui from './Components/Fileui'
import LandingPage from './Components/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* First Page */}
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              
            </>
          }
        />

        {/* File UI Page */}
        <Route path="/dashabord" element={<Fileui />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
