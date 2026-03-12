// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function normalizeToken(raw?: string | null): string | null {
  if (!raw) return null;
  let t = raw.trim();

  // возможные префиксы: "Bearer ..." или случайные "token-..."
  if (t.toLowerCase().startsWith('bearer ')) t = t.slice(7).trim();
  if (t.toLowerCase().startsWith('token-')) t = t.slice(6).trim();

  // проверяем простую структуру JWT: 3 части через '.'
  if (t.split('.').length === 3) return t;
  return null;
}

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// глобальный интерсептор: в ответах ловим 401 и пробрасываем специальную ошибку
export function attach401Handler(onUnauthorized: () => void) {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(err);
    }
  );
}

export default api;