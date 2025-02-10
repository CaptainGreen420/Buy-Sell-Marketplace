import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        });
        setProduct(response.data.product);
        if (response.data.product.sellerId) {
          setSellerName(`${response.data.product.sellerId.firstName} ${response.data.product.sellerId.lastName}`);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setMessage('Unauthorized access. Please log in.');
        } else {
          console.error("Error fetching product:", error);
        }
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/products/cart/add',
            { productId: id }, // Use the id from useParams
            {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` }
            }
        );
        
        if (response.data.success) {
            setMessage('Product added to cart successfully!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } else {
            setMessage(response.data.message);
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error adding product to cart';
        setMessage(errorMsg);
        console.error("Error adding product to cart:", errorMsg);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Product not found</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl mb-4 text-center font-semibold">{product.name}</h2>
        {message && (
          <div className={`mb-4 p-2 rounded text-center ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
        <div className="mb-4">
          <p className="text-gray-700"><span className="font-medium">Category:</span> {product.category}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700"><span className="font-medium">Price:</span> ₹{product.price}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700"><span className="font-medium">Description:</span> {product.description}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700"><span className="font-medium">Seller:</span> {sellerName}</p>
        </div>
        <div className="mb-4 flex justify-center">
          {product.status === 'available' ? (
            <button 
              onClick={handleAddToCart}
              className="bg-blue-500 transition-colors text-white font-medium w-full p-2 rounded-lg"
            >
              Add to Cart
            </button>
          ) : (
            <p className="bg-blue-500 transition-colors text-white text-center font-medium w-full p-2 rounded-lg">
              {product.status === 'sold' ? 'Sold' : 'Out of stock'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
