import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../app/hooks';
import type { RootState } from '../../../app/store';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector((s: RootState) => s.auth.user);

  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/profile" className="logo" aria-label="Profile link">
          <div className="badge">{(user?.firstName?.[0] ?? 'A').toUpperCase()}</div>
          <div>
            <div style={{fontSize:14, lineHeight:1}}>{t('dashboard')}</div>
            <div className="subtle" style={{fontSize:12}}>{user ? `${user.firstName ?? user.name ?? ''}` : t('admin')}</div>
          </div>
        </Link>
      </div>

      <div className="app-header__right">
        <span className="subtle">{user?.email ?? ''}</span>
      </div>
    </header>
  );
};

export default Header;
