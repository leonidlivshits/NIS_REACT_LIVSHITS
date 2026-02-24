// src/pages/Login/index.tsx  (обновлённая версия с fallback)
import React, { useState } from 'react';
import { useLoginMutation } from '../../app/api/apiSlice';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useTranslation } from 'react-i18next';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in (error as any);
}
function hasMessage(obj: unknown): obj is { message: string } {
  return typeof obj === 'object' && obj !== null && 'message' in (obj as any) && typeof (obj as any).message === 'string';
}

const safeSetItem = (key: string, value: string) => {
  try {
    if (typeof globalThis.localStorage === 'object' && typeof globalThis.localStorage?.setItem === 'function') {
      globalThis.localStorage.setItem(key, value);
    }
  } catch {
  }
};

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
    try {
      const res = await login({ username: username.trim(), password }).unwrap();
      if (res?.token) {
        dispatch(setCredentials({ token: res.token, user: res.user ?? null }));
        safeSetItem('token', res.token);
        if (res.user) safeSetItem('user', JSON.stringify(res.user));
        navigate('/', { replace: true });
      } else {
        setError(t('login_error'));
      }
    } catch (err: unknown) {
      if (isFetchBaseQueryError(err)) {
        const data = err.data;
        if (hasMessage(data)) {
          const translated = t('invalid_credentials');
          if (typeof translated === 'string' && translated !== 'invalid_credentials') {
            setError(translated);
          } else {
            setError(data.message);
          }
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
      <form onSubmit={onSubmit} className="login-form" aria-label="login-form">
        <label>
          {t('username')}
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          {t('password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={isLoading}>{t('submit')}</button>
        {error && <div role="alert" className="error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;