import React, { useEffect } from 'react';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLang, setTheme, setPageSize } from '../../features/settings/settingsSlice';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../app/store';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s: RootState) => s.settings);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (settings?.lang) i18n.changeLanguage(settings.lang);
    if (settings?.theme) document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings, i18n]);

  const changeLang = (lang: 'en' | 'ru') => {
    dispatch(setLang(lang));
    i18n.changeLanguage(lang);
  };

  const changeTheme = (theme: 'light' | 'dark') => {
    dispatch(setTheme(theme));
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <ProtectedLayout>
      <div className="settings-page card">
        <h2 className="main-title">{t('settings')}</h2>

        <div className="setting-row">
          <label>{t('language')}</label>
          <div>
            <button onClick={() => changeLang('en')} disabled={settings?.lang === 'en'} className="btn small">EN</button>
            <button onClick={() => changeLang('ru')} disabled={settings?.lang === 'ru'} className="btn small" style={{ marginLeft:8 }}>RU</button>
          </div>
        </div>

        <div className="setting-row" style={{ marginTop:12 }}>
          <label>{t('theme')}</label>
          <div>
            <button onClick={() => changeTheme('light')} disabled={settings?.theme === 'light'} className="btn small">{t('light')}</button>
            <button onClick={() => changeTheme('dark')} disabled={settings?.theme === 'dark'} className="btn small" style={{ marginLeft:8 }}>{t('dark')}</button>
          </div>
        </div>

        <div className="setting-row" style={{ marginTop:12 }}>
          <label>{t('catalog_page_size')}</label>
          <div>
            <select value={settings?.pageSize ?? 10} onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default SettingsPage;
