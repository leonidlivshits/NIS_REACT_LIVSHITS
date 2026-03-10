import { useMemo } from 'react'
import { useCollectionStore } from '@/stores/useCollectionStore'
import { useUIStore } from '@/stores/useUIStore'

export default function CollectionList() {
  const items = useCollectionStore((s) => s.items) as any[]
  const removeItem = useCollectionStore((s) => s.removeItem)
  const totalSelector = useCollectionStore((s) => (s as any).totalSpent)
  const total = typeof totalSelector === 'function' ? totalSelector() : (totalSelector ?? 0)

  const searchCollection = useUIStore((s) => s.searchCollection)
  const uiFilters = useUIStore((s) => s.filters)

  const sortBy = uiFilters?.sortBy
  const sortOrder = uiFilters?.sortOrder || 'desc'

  const getArtistName = (it: any) => {
    if (!it) return ''
    if (typeof it.artist === 'string') return it.artist
    if (typeof it.artist === 'object' && it.artist?.name) return it.artist.name
    return it.artistName ?? it.artist?.artistName ?? ''
  }

  const getCurrentPrice = (it: any) => {
    if (!it) return 0
    const v = it.currentPrice ?? it.price ?? it.purchasePrice
    if (typeof v === 'number') return v
    if (typeof v === 'string' && v !== '') {
      const n = Number(v)
      return Number.isFinite(n) ? n : 0
    }
    return 0
  }

  const getItemTime = (it: any) => {
    const cand = it.createdAt ?? it.purchaseDate ?? it.addedAt ?? it.date
    if (!cand) return 0
    if (cand instanceof Date) return cand.getTime()
    const t = Date.parse(cand)
    return Number.isFinite(t) ? t : 0
  }

  const filtered = useMemo(() => {
    let res = (items || []).slice()

    const q = (searchCollection || '').trim().toLowerCase()
    if (q) {
      res = res.filter((it) => {
        const combined = `${getArtistName(it) ?? ''} ${String(it.title ?? '')}`.toLowerCase()
        return combined.includes(q)
      })
    }

    if (uiFilters?.type) {
      res = res.filter((it) => ('type' in it ? it.type === uiFilters.type : false))
    }
    if (uiFilters?.condition) {
      res = res.filter((it) => ('condition' in it ? it.condition === uiFilters.condition : false))
    }
    if (uiFilters?.minPrice != null) {
      res = res.filter((it) => getCurrentPrice(it) >= (uiFilters.minPrice ?? 0))
    }
    if (uiFilters?.maxPrice != null) {
      res = res.filter((it) => getCurrentPrice(it) <= (uiFilters.maxPrice ?? Infinity))
    }

    if (sortBy === 'price') {
      res.sort((a: any, b: any) => (sortOrder === 'asc' ? getCurrentPrice(a) - getCurrentPrice(b) : getCurrentPrice(b) - getCurrentPrice(a)))
    } else if (sortBy === 'name') {
      res.sort((a: any, b: any) => (sortOrder === 'asc' ? String(a.title ?? '').localeCompare(String(b.title ?? '')) : String(b.title ?? '').localeCompare(String(a.title ?? ''))))
    } else if (sortBy === 'artist') {
      res.sort((a: any, b: any) => {
        const an = getArtistName(a)
        const bn = getArtistName(b)
        return sortOrder === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an)
      })
    } else {
      res.sort((a: any, b: any) => {
        const ta = getItemTime(a)
        const tb = getItemTime(b)
        return sortOrder === 'asc' ? ta - tb : tb - ta
      })
    }

    return res
  }, [items, searchCollection, uiFilters, sortBy, sortOrder])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collection</h2>
        <div className="text-sm">Total: {Number(total || 0).toFixed(2)}</div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-gray-500">No items in collection.</div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((it: any) => (
            <li key={it.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{getArtistName(it)} - {it.title}</div>
                <div className="text-sm text-gray-500">{it.currency ?? 'USD'} {getCurrentPrice(it)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeItem(it.id)} className="text-sm px-2 py-1 border rounded">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
