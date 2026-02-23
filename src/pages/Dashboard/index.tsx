import React from 'react';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ProtectedLayout>
      <div className="dashboard-page">
        <h2>{t('dashboard')}</h2>
        <p>Welcome to the admin dashboard. Use the sidebar to navigate.</p>
      </div>
    </ProtectedLayout>
  );
};

export default DashboardPage;
