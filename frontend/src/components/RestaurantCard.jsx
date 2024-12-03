import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  const renderStars = () => {
    const fullStars = Math.floor(restaurant.rating || 0); // Full stars
    const halfStar = restaurant.rating % 1 >= 0.5 ? 1 : 0; // Half star
    const emptyStars = 5 - fullStars - halfStar; // Empty stars

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FontAwesomeIcon
            key={`full-${index}`}
            icon={faStar}
            style={{ color: '#ffc107', marginRight: '4px' }}
          />
        ))}
        {halfStar === 1 && (
          <FontAwesomeIcon
            key="half-star"
            icon={faStarHalfAlt}
            style={{ color: '#ffc107', marginRight: '4px' }}
          />
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <FontAwesomeIcon
            key={`empty-${index}`}
            icon={faStarOutline}
            style={{ color: '#ddd', marginRight: '4px' }}
          />
        ))}
      </>
    );
  };
  
  const extractCity = (address) => {
    if (!address) return 'N/A';
    const addressParts = address.split(',').map((part) => part.trim());
    return addressParts[addressParts.length - 3] || addressParts[0] || 'N/A';
    };

  return (
    <div
      className="card h-100"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={restaurant.imageUrl || 'https://via.placeholder.com/640x480'}
        className="card-img-top"
        alt={restaurant.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{restaurant.name}</h5>
        <p className="card-text">{restaurant.address}</p>
        <p className="card-text">
          <strong>City:</strong> {extractCity(restaurant.address)}
        </p>
        <p className="card-text">
          <strong>Category:</strong> {restaurant.categories.join(', ')}
        </p>
        <p className="card-text">
        </p>
          <strong>Rating:</strong>
          <div className="d-flex align-items-center">
            {renderStars()}
            <span className="ms-2">{restaurant.rating} / 5</span>
          </div>
        
      </div>
    </div>
  );
};

export default RestaurantCard;
