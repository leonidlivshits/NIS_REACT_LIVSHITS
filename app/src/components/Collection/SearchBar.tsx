import { useUIStore } from '@/stores/useUIStore'

export default function SearchBar() {
  const searchCollection = useUIStore((s) => s.searchCollection)
  const setSearchCollection = useUIStore((s) => s.setSearchCollection)

  return (
    <div className="w-full">
      <label htmlFor="merch-search" className="sr-only">Search</label>
      <input
        id="merch-search"
        type="search"
        value={searchCollection}
        onChange={(e) => setSearchCollection(e.target.value)}
        placeholder="Search artist or title"
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
        autoComplete="off"
      />
    </div>
  )
}