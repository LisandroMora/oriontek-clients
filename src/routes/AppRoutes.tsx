import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';

const ClientsPage = lazy(() => import('@/pages/Clients/ClientsPage'));
const ClientDetailPage = lazy(() => import('@/pages/ClientDetail/ClientDetailPage'));

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <ClientsPage />
            </Suspense>
          }
        />
        <Route
          path="clients/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClientDetailPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}