import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    contactNumber: '',
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
        const token = Cookies.get('token');
        const email = Cookies.get('userEmail');
        try {
            const response = await axios.post(`http://localhost:4000/api/user/details`, 
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
            setUserDetails(response.data.user);
            setFormData({
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                age: response.data.user.age,
                contactNumber: response.data.user.contactNumber,
                currentPassword: '',
                newPassword: ''
            });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Error fetching user details');
        }
    };

    fetchUserDetails();
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
    if (formData.newPassword && formData.newPassword === formData.currentPassword) {
      setError('New password cannot be the same as the current password');
      return;
    }
    try {
        const response = await axios.post('http://localhost:4000/api/user/update', 
            {   
                email: userEmail,
                ...formData
            },
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
        );
        if (response.data.success) {
            setUserDetails(response.data.user);
            setIsEditing(false);
            setError('');
        } else {
            setError('Error updating user details');
        }
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Error updating user details');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const userEmail = Cookies.get('userEmail');

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-120">
        <h1 className="text-3xl mb-4 text-center font-semibold">Profile</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="mb-4"><strong>Email:</strong> {userEmail}</p>
        {userDetails && (
          <div>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="mb-2 relative col-span-2">
                  <label className="block text-gray-700 font-medium">Current Password</label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                  <span
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-10 cursor-pointer text-xl"
                  >
                    {showCurrentPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                <div className="mb-2 relative col-span-2">
                  <label className="block text-gray-700 font-medium">New Password (optional)</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-10 cursor-pointer text-xl"
                  >
                    {showNewPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleSave}
                    className="w-full bg-blue-500 text-white p-2 rounded-lg font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4"><strong>First Name:</strong> {userDetails.firstName}</p>
                <p className="mb-4"><strong>Last Name:</strong> {userDetails.lastName}</p>
                <p className="mb-4"><strong>Age:</strong> {userDetails.age}</p>
                <p className="mb-4"><strong>Contact Number:</strong> {userDetails.contactNumber}</p>
                <br></br>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setFormData({
                      ...formData,
                      currentPassword: '',
                      newPassword: ''
                    });
                  }}
                  className="w-full bg-blue-500 text-white p-2 rounded-lg font-medium"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
