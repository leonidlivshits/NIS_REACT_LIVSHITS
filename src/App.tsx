import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import RouteWrapper from './shared/RouteWrapper';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const ProductList = React.lazy(() => import('./pages/ProductList'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const token = useSelector((s: RootState) => s.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={!token ? <RouteWrapper><Login /></RouteWrapper> : <Navigate to="/" replace />} />
        <Route path="/register" element={!token ? <RouteWrapper><Login /></RouteWrapper> : <Navigate to="/" replace />} />

        {/* Protected */}
        <Route path="/" element={token ? <RouteWrapper><Dashboard /></RouteWrapper> : <Navigate to="/login" replace />} />
        <Route path="/products" element={token ? <RouteWrapper><ProductList /></RouteWrapper> : <Navigate to="/login" replace />} />
        <Route path="/products/:id" element={token ? <RouteWrapper><ProductPage /></RouteWrapper> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={token ? <RouteWrapper><Profile /></RouteWrapper> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={token ? <RouteWrapper><Settings /></RouteWrapper> : <Navigate to="/login" replace />} />

        <Route path="/logout" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<RouteWrapper><NotFound /></RouteWrapper>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
