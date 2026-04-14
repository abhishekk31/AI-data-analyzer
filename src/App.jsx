import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Fileui from './Componets/Fileui'
import LandingPage from './Componets/LandingPage'
import Card from './Componets/Card'
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
              <Card />
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
