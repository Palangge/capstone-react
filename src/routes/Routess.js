import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { Contact } from '../pages/Contact';
import { Products } from '../pages/Products';
import { ProductsAdd } from '../pages/ProductsAdd';
import { ProductDetails } from '../pages/ProductDetails';
import { About } from '../pages/About';
import { Logout } from '../pages/Logout';
import { NotFound } from '../pages/NotFound';

export const Routess = () => {
  const [isAdmin, setIsAdmin] = React.useState(localStorage.getItem("isAdmin"));

  useEffect(() => {
   setIsAdmin(localStorage.getItem("isAdmin"));
 }, []);

 if(isAdmin==='true'||isAdmin===true){
  console.log("1:"+isAdmin);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/contact/:id" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<ProductsAdd />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
 }else{
  console.log("2:"+isAdmin);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
 }
};