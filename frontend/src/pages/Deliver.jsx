import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Deliver = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); // Map orderId to entered otp
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('http://localhost:4000/api/orders/deliver', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setDeliveries(response.data.deliverOrders);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchDeliveries();
  }, []);

  const handleChange = (orderId, value) => {
    setOtpInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleCloseOrder = async (orderId) => {
    try {
      const token = Cookies.get('token');
      const otp = otpInputs[orderId];
      const response = await axios.post('http://localhost:4000/api/orders/close', { orderId, otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDeliveries(prev => prev.filter(order => order._id !== orderId));
        setNotification({ message: 'Order closed successfully', type: 'success' });
      } else {
        setNotification({ message: response.data.message, type: 'error' });
      }
    } catch (err) {
      setNotification({ 
        message: err.response?.data?.message || "Error closing order", 
        type: 'error' 
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl mb-4 text-center font-semibold">Pending Deliveries</h2>
        
        {/* Notification Display */}
        {notification.message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {notification.message}
          </div>
        )}

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {deliveries.length === 0 ? (
          <p className="text-center text-gray-500">No pending deliveries</p>
        ) : (
          <ul className="space-y-4">
            {deliveries.map(order => (
              <li 
                key={order._id} 
                className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium text-gray-800">{order.Item.name}</p>
                    <p className="text-gray-600">Price: ₹{order.Item.price}</p>
                    <p className="text-gray-600">Buyer: {order.buyerId.email || order.buyerId.name}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <input 
                      type="text" 
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ''}
                      onChange={e => handleChange(order._id, e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-32"
                    />
                    <button
                      onClick={() => handleCloseOrder(order._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors w-32"
                    >
                      Close Order
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Deliver;
