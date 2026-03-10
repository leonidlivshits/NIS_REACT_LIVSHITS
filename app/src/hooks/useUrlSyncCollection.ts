import { useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useAppStore } from '@/stores/appStore'

type Query = {
  q?: string
  type?: string
  condition?: string
  sortBy?: string
  sortOrder?: string
  view?: string
}

const parseQuery = (search: string): Query => {
  const p = new URLSearchParams(search)
  const q = p.get('q') || undefined
  const type = p.get('type') || undefined
  const condition = p.get('condition') || undefined
  const sortBy = p.get('sortBy') || undefined
  const sortOrder = p.get('sortOrder') || undefined
  const view = p.get('view') || undefined
  return { q, type, condition, sortBy, sortOrder, view }
}

const buildSearch = (payload: Query) => {
  const p = new URLSearchParams()
  if (payload.q) p.set('q', payload.q)
  if (payload.type) p.set('type', payload.type)
  if (payload.condition) p.set('condition', payload.condition)
  if (payload.sortBy) p.set('sortBy', payload.sortBy)
  if (payload.sortOrder) p.set('sortOrder', payload.sortOrder)
  if (payload.view) p.set('view', payload.view)
  const s = p.toString()
  return s ? `?${s}` : ''
}

export function useUrlSyncCollection() {
  const searchCollection = useUIStore((s) => s.searchCollection)
  const setSearchCollection = useUIStore((s) => s.setSearchCollection)
  const uiFilters = useUIStore((s) => s.filters)
  const setUIFilters = useUIStore((s) => s.setFilters)
  const setAppFilter = useAppStore((s) => s.setFilter)

  const skipNextPush = useRef(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    const { search, pathname } = window.location
    if (!pathname.endsWith('/collection')) return

    const q = parseQuery(search)
    if (q.q !== undefined) setSearchCollection(q.q)
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
    if (!window.location.pathname.endsWith('/collection')) return


    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      const q = {
        q: searchCollection || undefined,
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
  }, [searchCollection, uiFilters])

  useEffect(() => {
    const onPop = () => {
      const { search, pathname } = window.location
      if (!pathname.endsWith('/collection')) return
      const q = parseQuery(search)
      skipNextPush.current = true
      if (q.q !== undefined) setSearchCollection(q.q)
      else setSearchCollection('')
      const patch: any = {}
      if (q.type !== undefined) patch.type = q.type
      else patch.type = undefined
      if (q.condition !== undefined) patch.condition = q.condition
      else patch.condition = undefined
      if (q.sortBy !== undefined) patch.sortBy = q.sortBy
      else patch.sortBy = undefined
      if (q.sortOrder !== undefined) patch.sortOrder = q.sortOrder
      else patch.sortOrder = undefined
      setUIFilters(patch)
      setAppFilter(patch)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
}