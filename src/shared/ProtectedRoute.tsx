import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

type Props = { children: React.ReactElement };

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = useSelector((s: RootState) => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
