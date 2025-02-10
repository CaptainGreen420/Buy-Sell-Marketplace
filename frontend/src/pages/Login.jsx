import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:4000/api/user/checkToken',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError("Please verify that you are not a robot");
      return;
    }
    try {
      // Log the data being sent to the server
      console.log('Sending data:', { ...formData, recaptchaToken });

      const response = await axios.post('http://localhost:4000/api/user/login', { ...formData, recaptchaToken });

      // Log the server response
      console.log('Server response:', response.data);

      if (response.data.success) {
        Cookies.set('token', response.data.token);
        Cookies.set('userEmail', formData.email);
        setIsLoggedIn(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        setError(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRecaptcha = (token) => {
    console.log('ReCAPTCHA token:', token);
    setRecaptchaToken(token);
  };

  if (isLoggedIn) {
    window.location.href = "/profile";
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl mb-4 text-center font-semibold">Login</h2>
        <br></br>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mt-4">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={handleRecaptcha}
          />
        </div>
        <br></br>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg font-medium">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

export const ProtectedRoute = () => {
  const token = Cookies.get('token');
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:4000/api/user/checkToken',
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsValidToken(response.data.success);
      } catch (error) {
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isValidToken === null) {
    return <div>Loading...</div>;
  }

  if (!isValidToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
