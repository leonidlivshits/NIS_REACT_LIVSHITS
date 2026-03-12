import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

interface User {
  id: number;
  username: string;
}

const Profile: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (!cancelled) setUser(res.data.user ?? null);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setError('Session expired or unauthorized. Logging out...');
          onLogout();
        } else {
          setError('Failed to fetch profile');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();

    return () => { cancelled = true; };
  }, [token, onLogout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="mb-2"><span className="font-semibold">ID:</span> {user?.id}</p>
        <p className="mb-4"><span className="font-semibold">Username:</span> {user?.username}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLogout} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Profile;