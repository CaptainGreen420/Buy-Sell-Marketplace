import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('pendingOrders');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get('token');
        console.log('Token:', token); // Log the token

        const response = await axios.get('http://localhost:4000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data); // Log the response data

        if (response.data.success) {
          setPendingOrders(response.data.pendingOrders);
          setBoughtItems(response.data.boughtItems);
          setSoldItems(response.data.soldItems);
        }
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data?.message || error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <div className="flex justify-around mb-6">
          {['pendingOrders', 'boughtItems', 'soldItems'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 rounded-lg font-medium mx-2 w-1/3 transition-colors ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tab === 'pendingOrders' ? 'Pending Orders' : tab === 'boughtItems' ? 'Bought Items' : 'Sold Items'}
            </button>
          ))}
        </div>

        {activeTab === 'pendingOrders' && (
          <div>
            <h2 className="text-2xl mb-4 text-center font-semibold">Pending Orders</h2>
            <ul className="space-y-4">
              {pendingOrders.map(order => {
                const otpMapping = JSON.parse(localStorage.getItem('ordersWithOtp') || '{}');
                const plainOtp = otpMapping[order._id];
                return (
                  <li 
                    key={order._id} 
                    className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.open(`/product/${order.Item._id}`, '_blank')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium text-gray-800">{order.Item.name}</p>
                        <p className="text-gray-600">Price: ₹{order.Item.price}</p>
                        {plainOtp && (
                          <p className="font-medium mt-1">OTP: {plainOtp}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === 'boughtItems' && (
          <div>
            <h2 className="text-2xl mb-4 text-center font-semibold">Bought Items</h2>
            <ul className="space-y-4">
              {boughtItems.map(order => (
                <li 
                  key={order._id} 
                  className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(`/product/${order.Item._id}`, '_blank')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{order.Item.name}</p>
                      <p className="text-gray-600">Price: ₹{order.Item.price}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {activeTab === 'soldItems' && (
          <div>
            <h2 className="text-2xl mb-4 text-center font-semibold">Sold Items</h2>
            <ul className="space-y-4">
              {soldItems.map(order => (
                <li 
                  key={order._id} 
                  className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(`/product/${order.Item._id}`, '_blank')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{order.Item.name}</p>
                      <p className="text-gray-600">Price: ₹{order.Item.price}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        )}

        {(activeTab === 'pendingOrders' && pendingOrders.length === 0) || 
         (activeTab === 'boughtItems' && boughtItems.length === 0) || 
         (activeTab === 'soldItems' && soldItems.length === 0) ? (
          <p className="text-center text-gray-500 mt-4">No items to display</p>
        ) : null}
      </div>
    </div>
  );
};

export default Orders;
