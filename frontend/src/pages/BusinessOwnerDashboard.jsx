import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BusinessOwnerDashboard = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const [restaurants, setRestaurants] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        hours: '',
        description: '',
        photos: [],
        categories: '',
        priceRange: 'Medium',
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch restaurants on component load
    const fetchRestaurants = useCallback(async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            if (!token) {
                setErrorMessage('You are not authenticated. Please log in.');
                return;
            }

            const { data } = await axios.get(`${backendUrl}/api/business-owner/my-restaurants`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRestaurants(data); // Update the state with fetched restaurants
        } catch (error) {
            console.error('Failed to fetch restaurants:', error.response?.data || error.message);
            setErrorMessage('Failed to fetch restaurants. Please try again later.');
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData((prevData) => ({
                ...prevData,
                photos: [...prevData.photos, file],
            }));
        }
    };

    const handleAddRestaurant = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'photos') {
                formData.photos.forEach((photo) => formDataObj.append('photos', photo));
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${backendUrl}/api/business-owner/add`,
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setRestaurants((prev) => [...prev, data]);
            setFormVisible(false);
            resetForm();
        } catch (error) {
            console.error('Failed to add restaurant:', error.response?.data || error.message);
            setErrorMessage('Failed to add restaurant');
        }
    };

    const handleUpdateRestaurant = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'photos') {
                formData.photos.forEach((photo) => formDataObj.append('photos', photo));
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `${backendUrl}/api/business-owner/update/${formData._id}`,
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setRestaurants((prev) =>
                prev.map((restaurant) => (restaurant._id === data._id ? data : restaurant))
            );
            setFormVisible(false);
            resetForm();
        } catch (error) {
            console.error('Failed to update restaurant:', error.response?.data || error.message);
            setErrorMessage('Failed to update restaurant');
        }
    };

    const handleCloseRestaurant = async (restaurantId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `${backendUrl}/api/business-owner/close/${restaurantId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(data.message); // Restaurant closed successfully
        } catch (error) {
            console.error('Failed to close restaurant:', error.response?.data || error.message);
        }
    };
    
    

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            contact: '',
            hours: '',
            description: '',
            photos: [],
            categories: '',
            priceRange: 'Medium',
        });
        setPreviewImage(null);
    };

    const toggleForm = (restaurant = null) => {
        if (restaurant) {
            setFormData({
                ...restaurant,
                categories: restaurant.categories.join(', '),
            });
        } else {
            resetForm();
        }
        setFormVisible(!formVisible);
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Business Owner Dashboard</h1>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <button className="btn btn-primary mb-3" onClick={() => toggleForm()}>
                {formVisible ? 'Cancel' : 'Add New Listing'}
            </button>

            {formVisible && (
                <form
                    className="border p-4 mb-4"
                    onSubmit={formData._id ? handleUpdateRestaurant : handleAddRestaurant}
                >
                    <div className="mb-3">
                        <label className="form-label">Restaurant Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contact Info</label>
                        <input
                            type="text"
                            name="contact"
                            className="form-control"
                            value={formData.contact}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hours</label>
                        <input
                            type="text"
                            name="hours"
                            className="form-control"
                            value={formData.hours}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Photos</label>
                        <input type="file" className="form-control" onChange={handleImageChange} />
                        {previewImage && <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" />}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Categories</label>
                        <input
                            type="text"
                            name="categories"
                            className="form-control"
                            value={formData.categories}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price Range</label>
                        <select
                            name="priceRange"
                            className="form-select"
                            value={formData.priceRange}
                            onChange={handleInputChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        {formData._id ? 'Update' : 'Add'} Restaurant
                    </button>
                </form>
            )}

            <div className="row">
                {restaurants.map((restaurant) => (
                    <div className="col-md-4 mb-4" key={restaurant._id}>
                        <div className="card">
                            <img
                                src={
                                    restaurant.photos?.[0]
                                        ? `${backendUrl}/${restaurant.photos[0]}`
                                        : 'https://via.placeholder.com/640x480'
                                }
                                alt={restaurant.name || 'Restaurant image'}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{restaurant.name}</h5>
                                <p className="card-text">
                                    <strong>Address:</strong> {restaurant.address}
                                </p>
                                <p className="card-text">
                                    <strong>Contact:</strong> {restaurant.contact}
                                </p>
                                <p className="card-text">
                                    <strong>Hours:</strong> {restaurant.hours}
                                </p>
                                <p className="card-text">
                                    <strong>Description:</strong> {restaurant.description}
                                </p>
                                <p className="card-text">
                                    <strong>Status:</strong> {restaurant.status || 'Open'}
                                </p>
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => toggleForm(restaurant)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleCloseRestaurant(restaurant._id)}
                                >
                                    Close Business
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessOwnerDashboard;
