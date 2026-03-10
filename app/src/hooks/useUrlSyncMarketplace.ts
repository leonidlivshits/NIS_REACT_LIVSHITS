import { useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useAppStore } from '@/stores/appStore'

type Query = {
  q?: string
  marketplace?: string
  sortBy?: string
  sortOrder?: string
  page?: string
  view?: string
}

const parseQuery = (search: string): Query => {
  const p = new URLSearchParams(search)
  return {
    q: p.get('q') || undefined,
    marketplace: p.get('marketplace') || undefined,
    sortBy: p.get('sortBy') || undefined,
    sortOrder: p.get('sortOrder') || undefined,
    page: p.get('page') || undefined,
    view: p.get('view') || undefined,
  }
}

const buildSearch = (payload: Query) => {
  const p = new URLSearchParams()
  if (payload.q) p.set('q', payload.q)
  if (payload.marketplace) p.set('marketplace', payload.marketplace)
  if (payload.sortBy) p.set('sortBy', payload.sortBy)
  if (payload.sortOrder) p.set('sortOrder', payload.sortOrder)
  if (payload.page) p.set('page', payload.page)
  if (payload.view) p.set('view', payload.view)
  const s = p.toString()
  return s ? `?${s}` : ''
}

export function useUrlSyncMarketplace() {
  const searchMarketplace = useUIStore((s) => s.searchMarketplace)
  const setSearchMarketplace = useUIStore((s) => s.setSearchMarketplace)
  const uiFilters = useUIStore((s) => s.filters)
  const setUIFilters = useUIStore((s) => s.setFilters)
  const setAppFilter = useAppStore((s) => s.setFilter)

  const skipNextPush = useRef(false)
  const debounceRef = useRef<number | null>(null)


  useEffect(() => {
    const { pathname, search } = window.location
    if (!pathname.endsWith('/marketplace')) return

    const q = parseQuery(search)
    if (q.q !== undefined) setSearchMarketplace(q.q)

    const patch: any = {}
    if (q.sortBy !== undefined) patch.sortBy = q.sortBy
    if (q.sortOrder !== undefined) patch.sortOrder = q.sortOrder
    if (Object.keys(patch).length > 0) {
      setUIFilters(patch)
      setAppFilter(patch)
    }

    window.history.replaceState({}, '', window.location.pathname + buildSearch(q))
  }, [])

  useEffect(() => {
    if (!window.location.pathname.endsWith('/marketplace')) return
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      const q = {
        q: searchMarketplace || undefined,
        marketplace: (uiFilters as any)?.marketplace || undefined,
        sortBy: uiFilters?.sortBy || undefined,
        sortOrder: uiFilters?.sortOrder || undefined,
        view: (() => {
          try {
            const p = new URLSearchParams(window.location.search)
            return p.get('view') || undefined
          } catch {
            return undefined
          }
        })(),
        page: (() => {
          try {
            const p = new URLSearchParams(window.location.search)
            return p.get('page') || undefined
          } catch {
            return undefined
          }
        })(),
      }
      const newSearch = buildSearch(q)
      window.history.replaceState({}, '', window.location.pathname + newSearch)
    }, 220)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [searchMarketplace, uiFilters?.sortBy, uiFilters?.sortOrder, uiFilters])

  useEffect(() => {
    const onPop = () => {
      const { pathname, search } = window.location
      if (!pathname.endsWith('/marketplace')) return
      const q = parseQuery(search)
      skipNextPush.current = true
      if (q.q !== undefined) setSearchMarketplace(q.q)
      else setSearchMarketplace('')
      const patch: any = {}
      patch.sortBy = q.sortBy ?? undefined
      patch.sortOrder = q.sortOrder ?? undefined
      setUIFilters(patch)
      setAppFilter(patch)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
}