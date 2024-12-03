import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [userRole, setUserRole] = useState(null); // Track user's role
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserRole(data.role); // Set the user's role
            } catch (error) {
                console.error('Failed to fetch user role:', error.message);
                setUserRole(null);
            }
        };

         // Call the function inside useEffect
        fetchUserRole();
    }, [backendUrl]); // Add backendUrl as a dependency


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    RestaurantFinder
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/find">
                                Find
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/team">
                                Team
                            </Link>
                        </li>
                        {userRole === 'Admin' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-dashboard">
                                    Admin
                                </Link>
                            </li>
                        )}
                        {userRole === 'BusinessOwner' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/busowner-dashboard">
                                    My Business
                                </Link>
                            </li>
                        )}
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to="#"
                                id="profileDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <FaUserCircle size={24} />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
