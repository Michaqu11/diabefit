import React from 'react';
import { Routes, Route } from "react-router-dom";
import Setting  from "./pages/Setting";
import MainLayout from './components/layout/MainLayout';
import NewEntry from './pages/NewEntry';
import NewProduct from './pages/NewProduct';
import NewBolus from './pages/NewBolus';
import Home from './pages/Home';
import "boxicons/css/boxicons.min.css"
import "./App.scss"

const App: React.FC = () => {
  return <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />}/>
          <Route path="/entry" element={<NewEntry />}/>
          <Route path="/bolus" element={<NewBolus />}/>
          <Route path="/product" element={<NewProduct />}/>
          <Route path="/setting" element={<Setting />}/>
        </Route>
      </Routes>
  </div>
};

export default App;
