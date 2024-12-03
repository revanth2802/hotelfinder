import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/api/auth/register`, formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url("/food8.jpg")`, // Replace with your background image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                className="card p-4 shadow"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
                    borderRadius: '10px',
                }}
            >
                <h1 className="text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-select"
                            onChange={handleChange}
                            required
                        >
                            <option value="User">User</option>
                            <option value="BusinessOwner">Business Owner</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    <p className="text-center text-muted mt-3">{message}</p>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login" className="text-primary">Login?</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
