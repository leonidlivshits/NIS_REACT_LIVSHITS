import React from 'react';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useProducts } from '../../features/products/useProducts';
import type { RootState } from '../../app/store';

const ProductListPage: React.FC = () => {
  const settingsPageSize = useAppSelector((s: RootState) => s.settings.pageSize);
  const { data, error, isLoading, isFetching, q, page, limit, search, next, prev } = useProducts(settingsPageSize);

  return (
    <ProtectedLayout>
      <div className="productlist-page">
        <div className="search-row">
          <input value={q} onChange={(e) => search(e.target.value)} placeholder="Search products..." />
          <button onClick={() => search(q)}>Search</button>
        </div>

        {isLoading || isFetching ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">Error loading products</div>
        ) : data && data.products.length === 0 ? (
          <div className="empty">No products found.</div>
        ) : (
          <div>
            <ul className="product-list">
              {data?.products.map((p) => (
                <li key={p.id} className="product-item">
                  <Link to={`/products/${p.id}`}>
                    <div className="product-title">{p.title}</div>
                    <div className="product-meta">Price: ${p.price} · Rating: {p.rating ?? '-'}</div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pagination">
              <button onClick={prev} disabled={page === 0}>Prev</button>
              <span>Page {page + 1}</span>
              <button onClick={next} disabled={data && (page + 1) * limit >= (data?.total ?? 0)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default ProductListPage;
