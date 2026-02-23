import React, { useState } from 'react';
import './styles.css';
import { useTranslation } from 'react-i18next';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(t('register_stub_success'));
  };

  return (
    <div className="register-page">
      <h2>{t('register')}</h2>
      <form onSubmit={onSubmit} className="register-form">
        <label>{t('username')}<input value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
        <label>{t('email')}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>{t('password')}<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required /></label>
        <button type="submit">{t('register')}</button>
      </form>
      {message && <div className="info">{message}</div>}
    </div>
  );
};

export default RegisterPage;
