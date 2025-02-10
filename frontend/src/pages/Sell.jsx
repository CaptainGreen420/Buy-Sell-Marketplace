import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Sell = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: ''
    });
    const [error, setError] = useState('');
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("Fetching products..."); // Debug log
                const response = await axios.get('http://localhost:4000/api/products/seller-products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    console.log("Products fetched successfully:", response.data.products); // Debug log
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Adding product..."); // Debug log
            const response = await axios.post('http://localhost:4000/api/products/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                console.log("Product added successfully:", response.data.product); // Debug log
                setProducts([...products, { ...response.data.product }]);
                setFormData({ name: '', price: '', description: '', category: '' });
                setError('');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setError("Failed to add product.");
        }
    };

    // New function to remove a product
    const handleRemoveProduct = async (productId, e) => {
        e.stopPropagation();
        try {
            // Updated endpoint for deletion to align with seller authorization
            const response = await axios.delete(`http://localhost:4000/api/products/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(products.filter(p => p._id !== productId));
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to remove product.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Panel: Product List */}
            <div className="md:w-3/5 p-4">
                <h2 className="text-3xl mb-6 text-center font-semibold mt-4">Your Products</h2>
                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No products listed yet.</p>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div 
                                key={product._id} 
                                className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer flex justify-between items-center"
                                onClick={() => window.open(`/product/${product._id}`, '_blank')}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">₹{product.price}</p>
                                    <p className="text-gray-500">{product.description}</p>
                                    <p className="text-gray-500">Category: {product.category}</p>
                                </div>
                                <button
                                    onClick={(e) => handleRemoveProduct(product._id, e)}
                                    className="w-10 h-10 bg-blue-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Panel: Add Product Form */}
            <div className="md:w-2/5 p-4 flex justify-center">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl mb-4 text-center font-semibold">Add Product</h2>
                    {error && <p className="mb-4 text-center">{error}</p>}
                    <br />
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg font-medium">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sell;
