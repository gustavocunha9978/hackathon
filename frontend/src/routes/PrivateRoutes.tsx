import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Layout from '../components/layout';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';

export const PrivateRoutes = () => {
  const { verifyToken } = useAuth();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await verifyToken();

      setIsLoading(false);
    })();
  }, [location]);

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
};
