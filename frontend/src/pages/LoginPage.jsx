import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/login`, formData);
            localStorage.setItem('token', data.token);
            setMessage('Login successful! Redirecting...');
            setTimeout(() => {
                if (data.user.role === 'User') navigate('/');
                if (data.user.role === 'BusinessOwner') navigate('/busowner-dashboard');
                if (data.user.role === 'Admin') navigate('/admin-dashboard');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url("/food9.jpg")`, // Replace with your background image URL
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
                <h1 className="text-center mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <p className="text-center text-muted mt-3">{message}</p>
                </form>
                <div className="text-center mt-3">
                    <Link to="/signup" className="text-primary">Signup?</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
