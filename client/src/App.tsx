import { useEffect, useState, useCallback } from 'react';
import LoginForm from './components/LoginForm';
import Profile from './pages/Profile';
import { normalizeToken, setAuthToken, attach401Handler } from './api';

function App() {
  const [token, setToken] = useState<string | null>(() => {
    const raw = localStorage.getItem('token');
    return normalizeToken(raw) ?? null;
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setToken(null);
  }, []);

  useEffect(() => {
    setAuthToken(token);

    const detach = attach401Handler(() => {
      logout();
    });
  }, [token, logout]);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {!token ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Profile token={token} onLogout={handleLogout} />}
    </div>
  );
}

export default App;