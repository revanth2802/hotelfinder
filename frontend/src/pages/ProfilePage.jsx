import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from backend
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
    
            if (!token) {
                navigate('/login'); // Redirect if not authenticated
                return;
            }
    
            try {
                const { data } = await axios.get(`${backendUrl}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                });
    
                setUser(data);
                setFormData(data); // Pre-fill form with user data
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
                setErrorMessage('Failed to load profile. Please try again later.');
            }
        };
    
        fetchUserProfile();
    }, [navigate, backendUrl]); // Add backendUrl to dependencies
    

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.put(
                `${backendUrl}/api/auth/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(data);
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error('Error saving user profile:', error.message);
            setErrorMessage('Failed to save changes. Please try again later.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/login'); // Redirect to login
    };

    return (
        <div className="container my-5">
            <h1 className="text-center">Profile</h1>
            <div className="card mx-auto" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h5 className="card-title">User Information</h5>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {isEditing ? (
                        // Edit form
                        <>
                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={formData.username || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                           
                            <button className="btn btn-success w-100 mt-3" onClick={handleSave}>
                                Save
                            </button>
                        </>
                    ) : (
                        // Display user information
                        <>
                            <p className="card-text">
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p className="card-text">
                                <strong>Email:</strong> {user.email}
                            </p>
        
                            <button
                                className="btn btn-primary w-100 mt-3"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        </>
                    )}
                    <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
