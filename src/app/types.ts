import type { Product } from '../entities/product/product';
import type { User } from '../entities/user/user';

export type ProductsResponse = { products: Product[]; total: number; skip: number; limit: number };
export type AuthResponse = { token: string; user?: User };
