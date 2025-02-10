import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Buy = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [userId, setUserId] = useState(null);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/user/details', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setUserId(response.data.user._id);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/products/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setItems(response.data.products);
                    const uniqueCategories = [...new Set(response.data.products.filter(item => item.status === 'available').map(item => item.category))];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        const fetchData = async () => {
            await fetchUserId();
            await fetchItems();
        };

        fetchData();
    }, [token]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const isNotUserProduct = item.sellerId._id !== userId;
        const isAvailable = item.status === 'available';
        return matchesSearch && matchesCategory && isNotUserProduct && isAvailable;
    });

    return (
        <div className="flex h-screen">
            {/* Left Panel: Product List */}
            <div className="w-3/5 p-4 overflow-y-auto">
                <br></br>
                <h2 className="text-3xl mb-4 text-center font-semibold">Available Products</h2>
                <br></br>
                {filteredItems.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    filteredItems.map(item => (
                        <div
                            key={item._id}
                            className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
                            onClick={() => window.open(`/product/${item._id}`, '_blank')}
                        >
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-gray-600">₹{item.price}</p>
                            <p className="text-gray-500">Vendor: {item.sellerId.firstName} {item.sellerId.lastName}</p>
                            <p className="text-gray-500">Category: {item.category}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Right Panel: Search and Filter */}
            <div className="w-2/5 p-4">
                <br></br>
                <h2 className="text-3xl mb-4 text-center font-semibold">Search and Filter</h2>
                <br></br>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <br></br>
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold">Filter by Category</h3>
                    <br />
                    <div className="grid grid-cols-2 gap-4 text-left">
                        {categories.map((category, index) => (
                            <label key={category} className={`block flex items-center pl-12`}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={handleCategoryChange}
                                    className="mr-2 rounded-full h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Buy;
