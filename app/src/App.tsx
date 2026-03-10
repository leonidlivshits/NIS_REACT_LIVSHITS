// app/src/App.tsx
import { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/ui-custom/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Collection } from '@/pages/Collection';
import { Marketplace } from '@/pages/Marketplace';
import { Wishlist } from '@/pages/Wishlist';
import { Community } from '@/pages/Community';
import { Statistics } from '@/pages/Statistics';
import { Profile } from '@/pages/Profile';
import { UserProfile } from '@/pages/UserProfile';
import { useAppStore } from '@/stores/appStore';
import { getCurrentUser } from '@/data/dataLoader';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

type Page =
  | 'dashboard'
  | 'collection'
  | 'marketplace'
  | 'wishlist'
  | 'community'
  | 'stats'
  | 'profile'
  | 'user-profile';

const routeToPage = (path: string): { page: Page; userId?: string } => {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/' || clean === '/dashboard') return { page: 'dashboard' }
  if (clean === '/collection') return { page: 'collection' }
  if (clean === '/marketplace') return { page: 'marketplace' }
  if (clean === '/wishlist') return { page: 'wishlist' }
  if (clean === '/community') return { page: 'community' }
  if (clean === '/stats') return { page: 'stats' }
  if (clean === '/profile') return { page: 'profile' }
  // user profile: /user/:id
  const userMatch = clean.match(/^\/user\/(.+)$/)
  if (userMatch) return { page: 'user-profile', userId: decodeURIComponent(userMatch[1]) }
  return { page: 'dashboard' }
}

const pageToPath = (page: Page, userId?: string) => {
  switch (page) {
    case 'dashboard': return '/';
    case 'collection': return '/collection';
    case 'marketplace': return '/marketplace';
    case 'wishlist': return '/wishlist';
    case 'community': return '/community';
    case 'stats': return '/stats';
    case 'profile': return '/profile';
    case 'user-profile': return userId ? `/user/${encodeURIComponent(userId)}` : '/community';
    default: return '/';
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const { pathname } = window.location
    return routeToPage(pathname).page
  })
  const [viewedUserId, setViewedUserId] = useState<string | null>(() => {
    const { pathname } = window.location
    return routeToPage(pathname).userId ?? null
  })

  const { login, theme, currentUser, initializeData } = useAppStore();

  useEffect(() => {
    // Initialize data from JSON files
    initializeData();

    // Initialize user only if not already logged in
    if (!currentUser) {
      const user = getCurrentUser();
      if (user) {
        login(user as any);
      }
    }

    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, login, currentUser, initializeData]);

  // Centralized navigation that updates URL and state
  const navigate = useCallback((page: Page, userId?: string, replace = false) => {
    const path = pageToPath(page, userId)
    if (replace) {
      window.history.replaceState({}, '', path)
    } else {
      window.history.pushState({}, '', path)
    }
    setCurrentPage(page)
    if (page === 'user-profile') {
      setViewedUserId(userId ?? null)
    } else {
      setViewedUserId(null)
    }
  }, [])

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const onPop = () => {
      const { pathname } = window.location
      const { page, userId } = routeToPage(pathname)
      setCurrentPage(page)
      setViewedUserId(userId ?? null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Handler passed to Layout and components
  const handlePageChange = (page: string, userId?: string) => {
    if (page === 'user-profile' && userId) {
      navigate('user-profile', userId)
    } else {
      // cast trusted page names
      const p = page as Page
      navigate(p)
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'collection':
        return <Collection />;
      case 'marketplace':
        return <Marketplace />;
      case 'wishlist':
        return <Wishlist />;
      case 'community':
        return <Community onPageChange={handlePageChange} />;
      case 'stats':
        return <Statistics />;
      case 'profile':
        return <Profile />;
      case 'user-profile':
        return viewedUserId ? <UserProfile userId={viewedUserId} onBack={() => navigate('community')} /> : <Community onPageChange={handlePageChange} />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={(p) => handlePageChange(p)} >
        {renderPage()}
      </Layout>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;