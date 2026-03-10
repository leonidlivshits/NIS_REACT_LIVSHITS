import { useState } from 'react'
import { useCollectionStore } from '../../stores/useCollectionStore'

export default function AddItemForm() {
  const addItem = useCollectionStore((s) => s.addItem)
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const p = parseFloat(price || '0')
    if (!artist.trim() || !title.trim()) return
    addItem({ artist: artist.trim(), title: title.trim(), price: isNaN(p) ? 0 : p, currency })
    setArtist('')
    setTitle('')
    setPrice('')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Artist</label>
        <input value={artist} onChange={(e) => setArtist(e.target.value)} className="mt-1 block w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full" />
        </div>
      </div>

      <div>
        <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white">Add</button>
      </div>
    </form>
  )
}