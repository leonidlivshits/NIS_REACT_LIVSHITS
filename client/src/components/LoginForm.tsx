import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { normalizeToken, setAuthToken } from '../api';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/login', { username, password });
      const rawTokenFromBody = response.data?.token ?? null;
      const rawTokenFromHeader = response.headers?.authorization ?? response.headers?.Authorization ?? null;
      const raw = rawTokenFromBody ?? rawTokenFromHeader ?? null;
      const token = normalizeToken(raw);

      if (!token) {
        throw new Error('Invalid token format from server (expected JWT).');
      }

      setAuthToken(token);
      localStorage.setItem('token', token);
      onLoginSuccess(token);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Login failed';
      setError(String(message));
      setAuthToken(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-blue-200 text-sm">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-3"
                >
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setUsername(''); setPassword(''); setError(null); }}
                className="text-sm text-blue-300 hover:text-white transition-colors"
              >
                Clear form
              </button>
              <button
                type="button"
                className="text-sm text-blue-300 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-blue-300/60">
              Demo credentials: <span className="text-blue-200">user / password</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;