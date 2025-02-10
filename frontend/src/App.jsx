import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Deliver from './pages/Deliver';
import Product from './pages/Product';
import Chat from './pages/Chat';
import { ProtectedRoute } from './pages/Login';

const App = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow flex justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ml-20">
        <div className="w-full max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/deliver" element={<Deliver />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
