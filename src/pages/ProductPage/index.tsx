import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../app/api/apiSlice';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import type { Product } from '../../entities/product/product';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? Number(id) : NaN;
  const { data, error, isLoading } = useGetProductByIdQuery(numericId, { skip: isNaN(numericId) });

  return (
    <ProtectedLayout>
      <div className="product-page">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">Error loading product</div>
        ) : data ? (
          <div className="product-card">
            <h2>{(data as Product).title}</h2>
            <div className="product-info">
              <strong>Price:</strong> ${(data as Product).price} · <strong>Rating:</strong> {(data as Product).rating ?? '-'}
            </div>
            <p>{(data as Product).description}</p>
            <div><strong>Category:</strong> {(data as Product).category}</div>
          </div>
        ) : (
          <div className="empty">Product not found.</div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default ProductPage;
