import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
      const fetchCartItems = async () => {
          try {
              const response = await axios.get('http://localhost:4000/api/products/cart/items', {
                  headers: { Authorization: `Bearer ${Cookies.get('token')}` }
              });
              
              if (response.data.success) {
                  setCartItems(response.data.cartItems);
                  calculateTotalCost(response.data.cartItems);
                  setError(null);
              }
          } catch (error) {
              const errorMessage = error.response?.data?.message || "Error fetching cart items";
              setError(errorMessage);
              console.error("Error fetching cart items:", errorMessage);
          }
      };

      fetchCartItems();
  }, []);

  const calculateTotalCost = (items) => {
      const total = items.reduce((sum, item) => sum + Number(item.price), 0);
      setTotalCost(total);
  };

  const handleRemoveFromCart = async (itemId) => {
      try {
          const response = await axios.delete(`http://localhost:4000/api/products/cart/${itemId}`, {
              headers: { Authorization: `Bearer ${Cookies.get('token')}` }
          });
          
          if (response.data.success) {
              const updatedCartItems = cartItems.filter(item => item._id !== itemId);
              setCartItems(updatedCartItems);
              calculateTotalCost(updatedCartItems);
              setError(null);
          }
      } catch (error) {
          const errorMessage = error.response?.data?.message || "Error removing item from cart";
          setError(errorMessage);
          console.error("Error removing item from cart:", errorMessage);
      }
  };

  const handleFinalOrder = async () => {
    try {
        const response = await axios.post('http://localhost:4000/api/orders/place', {}, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        });

        if (response.data.success) {
            // Build a mapping from orderId to plain OTP
            const mapping = {};
            response.data.ordersWithOtp.forEach(entry => {
                mapping[entry.orderId] = entry.otp;
            });
            localStorage.setItem('ordersWithOtp', JSON.stringify(mapping));
            setCartItems([]);
            setTotalCost(0);
            setNotification({ message: 'Order placed successfully!', type: 'success' });
        } else {
            setNotification({ message: response.data.message, type: 'error' });
        }
    } catch (error) {
        setNotification({ 
            message: error.response?.data?.message || "Error placing order", 
            type: 'error' 
        });
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-3xl mb-4 text-center font-semibold">Cart</h2>
              
              {/* Notification Display */}
              {notification.message && (
                <div className={`mb-4 p-3 rounded-lg text-center ${
                  notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {notification.message}
                </div>
              )}

              {error && (
                  <div className="text-red-500 text-center mb-4">
                      {error}
                  </div>
              )}
              {cartItems.length === 0 ? (
                  <p className="text-center">Your cart is empty</p>
              ) : (
                  <>
                      <ul>
                          {cartItems.map(item => (
                              <li 
                                  key={item._id} 
                                  className="mb-4 p-3 border rounded cursor-pointer"
                                  onClick={() => window.open(`/product/${item._id}`, '_blank')}
                              >
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <p className="text-gray-700">
                                              <span className="font-medium">Name:</span> {item.name}
                                          </p>
                                          <p className="text-gray-700">
                                              <span className="font-medium">Price:</span> ₹{item.price}
                                          </p>
                                      </div>
                                      <button
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveFromCart(item._id);
                                          }}
                                          className="w-10 h-10 bg-blue-500 text-white rounded-lg font-medium transition-colors"
                                      >
                                          X
                                      </button>
                                  </div>
                              </li>
                          ))}
                      </ul>
                      <div className="text-center font-medium mt-4 p-3 bg-gray-50 rounded">
                          <p>Total Cost: ₹{totalCost}</p>
                      </div>
                      <button
                        onClick={handleFinalOrder}
                        className="w-full bg-blue-500 text-white p-2 mt-4 rounded-lg font-medium transition-colors"
                      >
                        Final Order
                      </button>
                  </>
              )}
          </div>
      </div>
  );
};

export default Cart;
