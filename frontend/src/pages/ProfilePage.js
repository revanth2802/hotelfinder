import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data (simulate fetching from localStorage or backend)
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate('/login'); // Redirect to login if no user is logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Profile</h1>
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h5 className="card-title">User Information</h5>
          <p className="card-text"><strong>Username:</strong> {user.username}</p>
          <p className="card-text"><strong>Email:</strong> {user.email}</p>
          <p className="card-text"><strong>Country:</strong> {user.country}</p>
          <p className="card-text"><strong>City:</strong> {user.city}</p>
          <p className="card-text"><strong>Zipcode:</strong> {user.zipcode}</p>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
