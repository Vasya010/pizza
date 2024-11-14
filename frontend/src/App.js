import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Nav from './components/Nav';
import Footer from './components/Footer';
import Products from './components/Products';
import Cart from './components/Cart';
import OrderPage from './components/OrderPage';
import AdminPanel from './components/AdminPanel';
import Adminlogin from './components/adminlogin/Adminlogin';
import Aboud from "./components/Aboud";
import Loader from './components/Loader/Loader';

function App() {
  const userId = 1; // Замените на нужное значение
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const updateCart = (id, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with quantity 0

      return updatedItems;
    });
  };

  useEffect(() => {
    // Simulate a loading time (optional)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // Adjust as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />; // Show Loader while loading is true
  }

  return (
    <Router>
      <Nav />
      <Routes>
        {/* Главная страница с Products и Footer */}
        <Route 
          path="/" 
          element={
            <div>
              <Products updateCart={updateCart} /> {/* Передаем updateCart в Products */}
              <Footer />
              <Cart cartItems={cartItems} updateCart={updateCart} /> {/* Вставляем компонент Cart на главной странице */}
            </div>
          } 
        />

        {/* Страница оформления заказа */}
        <Route 
          path="/order" 
          element={<OrderPage cartItems={cartItems} updateCart={updateCart} />} 
        />

        {/* Страница Admin */}
        <Route path="/Admin" element={<Adminlogin userId={userId} />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />

        {/* Страница "О нас" */}
        <Route path="/about" element={<Aboud />} /> {/* Добавляем роут для страницы "О нас" */}
      </Routes>
    </Router>
  );
}

export default App;
