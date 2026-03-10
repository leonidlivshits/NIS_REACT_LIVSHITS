import {create} from 'zustand'
import { persist } from 'zustand/middleware'

export type Filters = {
  // domain filters
  type?: string
  condition?: string

  // price filters
  minPrice?: number | null
  maxPrice?: number | null

  // generic
  artist?: string
  merchType?: string

  // sort
  sortBy?: 'date' | 'price' | 'name' | 'artist'
  sortOrder?: 'asc' | 'desc'
}

type UIState = {
  searchCollection: string
  setSearchCollection: (s: string) => void

  searchMarketplace: string
  setSearchMarketplace: (s: string) => void

  searchWishlist: string
  setSearchWishlist: (s: string) => void

  filters: Filters
  setFilters: (patch: Partial<Filters>) => void
  resetFilters: () => void

  page: number
  setPage: (p: number) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      searchCollection: '',
      setSearchCollection: (s) => set({ searchCollection: s }),

      searchMarketplace: '',
      setSearchMarketplace: (s) => set({ searchMarketplace: s }),

      searchWishlist: '',
      setSearchWishlist: (s) => set({ searchWishlist: s }),

      filters: {},
      setFilters: (patch) =>
        set((state) => ({ filters: { ...(state.filters || {}), ...patch } })),
      resetFilters: () => set({ filters: {} }),

      page: 1,
      setPage: (p) => set({ page: p }),
    }),
    {
      name: 'merch-ui-storage',
      version: 1,
      migrate: (persistedState, version) => persistedState,
    }
  )
)