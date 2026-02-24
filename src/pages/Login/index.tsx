import React, { useState } from 'react';
import { useLoginMutation } from '../../app/api/apiSlice';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useTranslation } from 'react-i18next';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function getRuntimeBaseForLog() {
  const gw = globalThis as unknown as { __APP_API_BASE_URL?: string | undefined };
  if (gw.__APP_API_BASE_URL) return gw.__APP_API_BASE_URL;
  const im = import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } | undefined };
  if (im?.env?.VITE_API_BASE_URL) return im.env.VITE_API_BASE_URL;
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL)
    return process.env.REACT_APP_API_BASE_URL;
  return 'https://dummyjson.com';
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const base = getRuntimeBaseForLog() || '';
    const payload = { username, password };
    const curlCmd = `curl -i -X POST "${base.replace(/\/$/, '')}/auth/login" -H "Content-Type: application/json" -d "{"username":"${username}","password":"${password}"}"`;

    console.log('--- Login diagnostics ---');
    console.log('Computed base URL:', base);
    console.log('Request payload:', payload);
    console.log('Curl command (Windows cmd):\n', curlCmd);

    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user ?? null }));
      localStorage.setItem('token', res.token);
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (isFetchBaseQueryError(err)) {
        const data = err.data;
        if (data && typeof data === 'object' && 'message' in data) {
          setError((data as any).message);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError(t('login_error'));
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('login_error'));
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <h2>{t('login')}</h2>
      <form onSubmit={onSubmit} className="login-form">
        <label>
          {t('username')}
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          {t('password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {t('submit')}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
        Tip: default test creds - <strong>kminchelle / 0lelplR</strong> (DummyJSON example). If you
        use local mock, check src/mock/dummy.json.
      </div>
    </div>
  );
};

export default LoginPage;
