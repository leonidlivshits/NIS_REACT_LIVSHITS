import { useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useAppStore } from '@/stores/appStore'

type Query = {
  q?: string
  type?: string
  condition?: string
  sortBy?: string
  sortOrder?: string
  page?: string
}

const parseQuery = (search: string): Query => {
  const p = new URLSearchParams(search)
  return {
    q: p.get('q') || undefined,
    type: p.get('type') || undefined,
    condition: p.get('condition') || undefined,
    sortBy: p.get('sortBy') || undefined,
    sortOrder: p.get('sortOrder') || undefined,
    page: p.get('page') || undefined,
  }
}

const buildSearch = (payload: Query) => {
  const p = new URLSearchParams()
  if (payload.q) p.set('q', payload.q)
  if (payload.type) p.set('type', payload.type)
  if (payload.condition) p.set('condition', payload.condition)
  if (payload.sortBy) p.set('sortBy', payload.sortBy)
  if (payload.sortOrder) p.set('sortOrder', payload.sortOrder)
  if (payload.page) p.set('page', payload.page)
  const s = p.toString()
  return s ? `?${s}` : ''
}

export function useUrlSyncWishlist() {
  const searchWishlist = useUIStore((s) => s.searchWishlist)
  const setSearchWishlist = useUIStore((s) => s.setSearchWishlist)
  const uiFilters = useUIStore((s) => s.filters)
  const setUIFilters = useUIStore((s) => s.setFilters)
  const setAppFilter = useAppStore((s) => s.setFilter)

  const skipNextPush = useRef(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    const { pathname, search } = window.location
    if (!pathname.endsWith('/wishlist')) return

    const q = parseQuery(search)
    if (q.q !== undefined) setSearchWishlist(q.q)
    const patch: any = {}
    if (q.type !== undefined) patch.type = q.type
    if (q.condition !== undefined) patch.condition = q.condition
    if (q.sortBy !== undefined) patch.sortBy = q.sortBy
    if (q.sortOrder !== undefined) patch.sortOrder = q.sortOrder
    if (Object.keys(patch).length > 0) {
      setUIFilters(patch)
      setAppFilter(patch)
    }
    window.history.replaceState({}, '', window.location.pathname + buildSearch(q))
  }, [])

  useEffect(() => {
    if (!window.location.pathname.endsWith('/wishlist')) return
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      const q = {
        q: searchWishlist || undefined,
        type: uiFilters?.type || undefined,
        condition: uiFilters?.condition || undefined,
        sortBy: uiFilters?.sortBy || undefined,
        sortOrder: uiFilters?.sortOrder || undefined,
      }
      const newSearch = buildSearch(q)
      window.history.replaceState({}, '', window.location.pathname + newSearch)
    }, 220)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [searchWishlist, uiFilters])

  useEffect(() => {
    const onPop = () => {
      const { pathname, search } = window.location
      if (!pathname.endsWith('/wishlist')) return
      const q = parseQuery(search)
      skipNextPush.current = true
      if (q.q !== undefined) setSearchWishlist(q.q)
      else setSearchWishlist('')
      const patch: any = {}
      patch.type = q.type ?? undefined
      patch.condition = q.condition ?? undefined
      patch.sortBy = q.sortBy ?? undefined
      patch.sortOrder = q.sortOrder ?? undefined
      setUIFilters(patch)
      setAppFilter(patch)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
}