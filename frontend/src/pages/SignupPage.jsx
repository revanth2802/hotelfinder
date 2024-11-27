import React, { useState } from 'react';
import axios from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
    country: '',
    city: '',
    zipcode: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form className="w-80 bg-gray-100 p-4 rounded shadow" onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="User">User</option>
          <option value="BusinessOwner">Business Owner</option>
          <option value="Admin">Admin</option>
        </select>
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.country}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="zipcode"
          placeholder="Zipcode"
          className="block w-full p-2 mb-4 border rounded"
          value={formData.zipcode}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Signup
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
