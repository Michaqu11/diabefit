import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About  from "./pages/About";

const App: React.FC = () => (
  <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
      </Routes>
  </>
);

export default App;
