import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


vi.mock('../../widgets/layouts/ProtectedLayout', () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock('../../app/hooks', () => {
  return {
    useAppSelector: (selector: any) => selector({ settings: { pageSize: 10 } }),
  };
});

const mockSearch = vi.fn();
const mockNext = vi.fn();
const mockPrev = vi.fn();

vi.mock('../../features/products/useProducts', () => {
  return {
    useProducts: vi.fn(),
  };
});

import ProductListPage from './index';
import { useProducts } from '../../features/products/useProducts';

describe('ProductList page', () => {
  const sampleProducts = [
    { id: 1, title: 'Apple iPhone', price: 100, rating: 4.5, category: 'phones' },
    { id: 2, title: 'Samsung Galaxy', price: 200, rating: 4.2, category: 'phones' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders products and calls search on typing', async () => {
    (useProducts as unknown as any).mockImplementation(() => ({
      data: { products: sampleProducts, total: 2, skip: 0, limit: 10 },
      error: null,
      isLoading: false,
      isFetching: false,
      q: '',
      page: 0,
      limit: 10,
      search: mockSearch,
      next: mockNext,
      prev: mockPrev,
    }));

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Apple iPhone')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();

    const input = screen.getByLabelText('search-input');
    const user = userEvent.setup();
    await user.type(input, 'Apple');

    expect(mockSearch).toHaveBeenCalled();
  });

  it('calls pagination next then prev when buttons are clicked (buttons enabled)', async () => {
    (useProducts as unknown as any).mockImplementation(() => ({
      data: { products: sampleProducts, total: 100, skip: 0, limit: 10 },
      error: null,
      isLoading: false,
      isFetching: false,
      q: '',
      page: 0,
      limit: 10,
      search: mockSearch,
      next: mockNext,
      prev: mockPrev,
    }));

    const { unmount } = render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const nextBtn = screen.getByRole('button', { name: /next/i });
    await user.click(nextBtn);
    expect(mockNext).toHaveBeenCalled();

    unmount();

    (useProducts as unknown as any).mockImplementation(() => ({
      data: { products: sampleProducts, total: 100, skip: 10, limit: 10 },
      error: null,
      isLoading: false,
      isFetching: false,
      q: '',
      page: 1,
      limit: 10,
      search: mockSearch,
      next: mockNext,
      prev: mockPrev,
    }));

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    const prevBtn = screen.getByRole('button', { name: /prev/i });
    await user.click(prevBtn);
    expect(mockPrev).toHaveBeenCalled();
  });

  it('shows star svg and title contains no asterisk or arrow', () => {
    (useProducts as unknown as any).mockImplementation(() => ({
      data: { products: sampleProducts, total: 2, skip: 0, limit: 10 },
      error: null,
      isLoading: false,
      isFetching: false,
      q: '',
      page: 0,
      limit: 10,
      search: mockSearch,
      next: mockNext,
      prev: mockPrev,
    }));

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    const stars = screen.getAllByTestId('icon-star');
    expect(stars.length).toBeGreaterThan(0);
    expect(stars[0]).toBeInTheDocument();

    expect(screen.getByText('Apple iPhone').textContent).not.toContain('*');
    expect(screen.getByText('Apple iPhone').textContent).not.toContain('←');
  });
});