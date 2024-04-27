import React from 'react';
import './Card.css'; // Import your CSS file for styling

const Card = ({ name, address, date, price, trend }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{name}</h2>
        <p className="card-subtitle">{address}</p>
      </div>
      <div className="card-body">
        <p className="card-text">Date: {date}</p>
        <p className="card-text">Price: {price}</p>
        <p className="card-text">Trend: {trend}</p>
      </div>
    </div>
  );
};

export default Card;