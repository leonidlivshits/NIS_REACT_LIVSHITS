import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="notfound-page">
      <h2>404 Not Found</h2>
      <p>The page you requested doesn't exist.</p>
      <Link to="/">Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;
