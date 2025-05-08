import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export const AdminRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  return user &&
    (user.group !== 'user' || user.email === 'homologa.sector@biopark.com.br') ? (
    <Outlet />
  ) : (
    <Navigate replace to="/" state={{ from: location }} />
  );
};
