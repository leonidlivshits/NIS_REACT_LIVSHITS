import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export type MerchItem = {
  id: string
  artist: string
  title: string
  price: number
  currency?: string
  notes?: string
  createdAt: number
}

type State = {
  items: MerchItem[]
  addItem: (item: Omit<MerchItem, 'id' | 'createdAt'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, patch: Partial<MerchItem>) => void
  clearAll: () => void
  totalSpent: () => number
}

export const useCollectionStore = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              ...item,
              id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()),
              createdAt: Date.now(),
            },
          ],
        })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateItem: (id, patch) =>
        set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
      clearAll: () => set({ items: [] }),
      totalSpent: () => get().items.reduce((acc, it) => acc + (it.price || 0), 0),
    }),
    {
      name: 'merch-tracker-storage',
      version: 1,
      migrate: (persistedState, version) => {
        return persistedState
      },
    }
  )
)