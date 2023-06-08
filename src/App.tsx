import React from 'react';
import { Routes, Route } from "react-router-dom";
import Setting  from "./pages/Setting";
import MasterLayout from './components/layout/MasterLayout';
import NewEntry from './pages/NewEntry';
import NewProduct from './pages/NewProduct';
import NewBolus from './pages/NewBolus';
import Home from './pages/home/Home';
import AddProduct from './pages/AddProduct';
import "boxicons/css/boxicons.min.css"
import "./App.scss"


const App: React.FC = () => {
  return( 
  <div className='root'>
      <MasterLayout />
      <div className='router'>
        <Routes>
          <Route index element={<Home />}/>
          <Route path="/entry" element={<NewEntry />}/>
          <Route path="/bolus" element={<NewBolus />}/>
          <Route path="/product" element={<NewProduct />}/>
          <Route path="/setting" element={<Setting />}/>
          <Route path="/add/:id" element={<AddProduct />}/>
        </Routes>
      </div>
  </div>
  );
};

export default App;
