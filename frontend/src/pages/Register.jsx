import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add state for toggling password visibility
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:4000/api/user/checkToken', {token});
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        Cookies.remove('token');
      }
    };

    checkToken();
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRecaptcha = (token) => {
    console.log('ReCAPTCHA token:', token); // Log the ReCAPTCHA token
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, age, contactNumber, password } = formData;

    if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
      setError('All fields are required');
      return;
    }

    if (age < 1 || age > 150) {
      setError('Age must be between 1 and 150');
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be 10 digits');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    // Check if recaptcha is verified
    if (!recaptchaToken) {
      setError("Please verify that you are not a robot");
      return;
    }

    try {
      // Log the data being sent to the server
      console.log('Sending data:', { ...formData, recaptchaToken });

      // Pass recaptchaToken along with formData if needed
      const response = await axios.post('http://localhost:4000/api/user/register', { ...formData, recaptchaToken });

      // Log the server response
      console.log('Server response:', response.data);

      if (response.data.success) {
        navigate('/login'); // Redirect to login page
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        if (error.response.status === 409) {
          setError('Email already exists');
        } else {
          setError(error.response.data.message || 'An error occurred. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-120">
        <h2 className="text-3xl mb-4 text-center font-semibold">Register</h2>
        <br></br>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              required
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
              required
            />
          </div>
          <div className="mb-2 col-span-2">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              required
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
              required
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
              required
            />
          </div>
          <div className="mb-2 col-span-2">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={handleRecaptcha}
          />
        </div>
        <br></br>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg font-medium">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
