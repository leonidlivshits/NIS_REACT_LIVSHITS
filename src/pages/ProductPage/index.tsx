import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../app/api/apiSlice';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import type { Product } from '../../entities/product/product';
import ArrowLeftIcon from '../../shared/icons/ArrowLeft';
import StarIcon from '../../shared/icons/Star';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? Number(id) : NaN;
  const { data, error, isLoading } = useGetProductByIdQuery(numericId, { skip: isNaN(numericId) });

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="loader">Loading product...</div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="error-state">Error loading product. Please try again.</div>
      </ProtectedLayout>
    );
  }

  if (!data) {
    return (
      <ProtectedLayout>
        <div className="empty-state">Product not found.</div>
      </ProtectedLayout>
    );
  }

  const product = data as Product;

  return (
    <ProtectedLayout>
      <div className="product-page">
        <button onClick={() => navigate(-1)} className="back-btn" aria-label="go back">
          <ArrowLeftIcon /> <span>Back</span>
        </button>

        <div className="product-card">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-meta">
            <span className="product-price">${product.price}</span>

            {typeof product.rating === 'number' && (
              <span
                className="product-rating"
                aria-label={`rating ${product.rating.toFixed(1)}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 12 }}
              >
                <StarIcon aria-hidden />
                <span className="rating-value">{product.rating.toFixed(1)}</span>
              </span>
            )}

            {product.category && <span className="product-category" style={{ marginLeft: 12 }}>{product.category}</span>}
          </div>

          <p className="product-description">{product.description}</p>

          {product.images && product.images.length > 0 && (
            <div className="product-images" aria-label="product images">
              {product.images.slice(0, 4).map((img, idx) => (
                <img key={idx} src={img} alt={`${product.title} image ${idx + 1}`} loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default ProductPage;