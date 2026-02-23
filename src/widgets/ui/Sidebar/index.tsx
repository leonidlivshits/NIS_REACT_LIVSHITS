import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside className="app-sidebar card">
      <nav>
        <ul style={{ padding:0, margin:0 }}>
          <li><Link to="/">{t('dashboard')}</Link></li>
          <li><Link to="/products">{t('products')}</Link></li>
          <li><Link to="/profile">{t('profile')}</Link></li>
          <li><Link to="/settings">{t('settings')}</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
