import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import './styles.css';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const userInitial = user?.firstName?.[0] ?? user?.name?.[0] ?? 'A';
  const userName = user ? `${user.firstName ?? user.name ?? ''}` : t('admin');
  const userEmail = user?.email ?? '';

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/profile" className="logo">
          <div className="logo-badge">{userInitial.toUpperCase()}</div>
          <div className="logo-text">
            <div className="logo-title">{t('dashboard')}</div>
            <div className="logo-subtitle">{userName}</div>
          </div>
        </Link>
      </div>

      <div className="header-right">
        {userEmail && <span className="user-email">{userEmail}</span>}
        <button onClick={handleLogout} className="logout-button" title={t('logout')}>
          <LogoutIcon fontSize="small" />
        </button>
      </div>
    </header>
  );
};

export default Header;
