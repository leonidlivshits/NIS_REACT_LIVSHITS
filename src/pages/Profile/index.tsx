import React from 'react';
import ProtectedLayout from '../../widgets/layouts/ProtectedLayout';
import './styles.css';
import { useAppSelector } from '../../app/hooks';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useGetMeQuery } from '../../app/api/apiSlice';
import type { RootState } from '../../app/store';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const storeUser = useAppSelector((s: RootState) => s.auth.user);
  const token = useAppSelector((s: RootState) => s.auth.token);
  const { data: apiUser, isLoading } = useGetMeQuery(undefined, { skip: !token });
  const user = apiUser ?? storeUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <ProtectedLayout>
      <div className="profile-page card">
        <h2 className="main-title">{t('profile')}</h2>

        {isLoading ? (
          <div className="subtle">{t('loading')}</div>
        ) : user ? (
          <div>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
              <div style={{ width:64, height:64, borderRadius:12, background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                { (user.firstName??user.name??'U')[0].toUpperCase() }
              </div>
              <div>
                <div style={{ fontWeight:700 }}>{user.firstName ?? user.name ?? ''} {user.lastName ?? ''}</div>
                <div className="subtle">{user.email ?? ''}</div>
              </div>
            </div>

            <div style={{ marginTop:12 }}>
              <button className="btn" onClick={() => navigate('/settings')}>{t('settings')}</button>
              <button className="btn ghost" style={{ marginLeft:8 }} onClick={onLogout}>{t('logout')}</button>
            </div>
          </div>
        ) : (
          <div className="subtle">No user data.</div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default ProfilePage;
