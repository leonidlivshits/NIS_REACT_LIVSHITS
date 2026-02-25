import React, { ReactNode } from 'react';
import Header from '../../ui/Header';
import Sidebar from '../../ui/Sidebar';
import './styles.css';

type Props = { children: ReactNode };

export const ProtectedLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
