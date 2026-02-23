import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../entities/product/product';
import type { User } from '../../entities/user/user';

type ProductsResponse = { products: Product[]; total: number; skip: number; limit: number };
type AuthResponse = { token: string; user?: User };

function getRuntimeBase() {
  const gw = (globalThis as unknown) as { __APP_API_BASE_URL?: string | undefined };
  if (gw.__APP_API_BASE_URL) return gw.__APP_API_BASE_URL;
  const im = (import.meta as unknown) as { env?: { VITE_API_BASE_URL?: string } | undefined };
  if (im?.env?.VITE_API_BASE_URL) return im.env.VITE_API_BASE_URL;
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
  return 'https://dummyjson.com';
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Products', 'Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { username: string; password: string }>({
      query: (credentials) => {
        const base = getRuntimeBase().replace(/\/$/, '');
        return { url: `${base}/auth/login`, method: 'POST', body: credentials };
      },
    }),
    getMe: builder.query<User, void>({
      query: () => `${getRuntimeBase().replace(/\/$/, '')}/auth/me`,
      providesTags: ['Auth'],
    }),
    getProducts: builder.query<ProductsResponse, { limit?: number; skip?: number; q?: string }>(
      {
        query: ({ limit = 10, skip = 0, q }) => {
          const base = getRuntimeBase().replace(/\/$/, '');
          if (q && q.trim() !== '') {
            const params = new URLSearchParams();
            params.set('q', q);
            params.set('limit', String(limit));
            params.set('skip', String(skip));
            return `${base}/products/search?${params.toString()}`;
          }
          return `${base}/products?limit=${limit}&skip=${skip}`;
        },
        providesTags: (result) =>
          result
            ? [
                ...result.products.map((p) => ({ type: 'Products' as const, id: p.id })),
                { type: 'Products', id: 'LIST' },
              ]
            : [{ type: 'Products', id: 'LIST' }],
      }
    ),
    getProductById: builder.query<Product, number>({
      query: (id) => `${getRuntimeBase().replace(/\/$/, '')}/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useGetProductsQuery, useGetProductByIdQuery } = api;
