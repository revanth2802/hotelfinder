import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState(''); // Track selected role
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('You are not authenticated. Please log in.');
                    return;
                }

                const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsers(data);
                setFilteredUsers(data); // Show all users initially
            } catch (error) {
                console.error('Error fetching users:', error.message);
                setMessage('Failed to fetch users. Please try again later.');
            }
        };

        fetchUsers();
    }, [backendUrl]);

    // Filter users by role
    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setFilteredUsers(role ? users.filter((user) => user.role === role) : users);
    };

    // Fetch restaurants by BusinessOwner ID
    const fetchRestaurantsByOwner = async (ownerId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You are not authenticated. Please log in.');
                return;
            }

            const { data } = await axios.get(
                `${backendUrl}/api/business-owner/restaurants-by-owner/${ownerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setRestaurants(data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching restaurants:', error.message);
            setMessage('Failed to fetch restaurants. Please try again later.');
            setRestaurants([]);
        }
    };

    // Handle Delete Restaurant
    const handleDeleteRestaurant = async (restaurantId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You are not authenticated. Please log in.');
                return;
            }

            await axios.delete(
                `${backendUrl}/api/business-owner/delete/${restaurantId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update state to reflect deletion
            setRestaurants((prev) => prev.filter((r) => r._id !== restaurantId));
            setMessage('Restaurant deleted successfully.');
        } catch (error) {
            console.error('Error deleting restaurant:', error.message);
            setMessage('Failed to delete restaurant. Please try again later.');
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Admin Dashboard</h1>

            <div className="mb-4">
                <h3>Filter Users by Role</h3>
                <select
                    className="form-select mb-3"
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="User">User</option>
                    <option value="BusinessOwner">Business Owner</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>

            <div>
                <h3>Users</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role === 'BusinessOwner' && (
                                        <button
                                            className="btn btn-link"
                                            onClick={() => fetchRestaurantsByOwner(user._id)}
                                        >
                                            View Restaurants
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="my-4">
                <h3>Restaurants</h3>
                {message && <p className="text-danger">{message}</p>}
                {restaurants.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((restaurant) => (
                                <tr key={restaurant._id}>
                                    <td>{restaurant._id}</td>
                                    <td>{restaurant.name}</td>
                                    <td>{restaurant.address}</td>
                                    <td>{restaurant.contact}</td>
                                    <td>{restaurant.status || 'open'}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteRestaurant(restaurant._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !message && <p>No restaurants found for this BusinessOwner.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
