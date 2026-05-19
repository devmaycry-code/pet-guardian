import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/app-shell';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { NgoDashboardPage } from '../pages/ngo-dashboard-page';
import { OrganizationPage } from '../pages/organization-page';
import { FollowingPage } from '../pages/following-page';
import { PetProfilePage } from '../pages/pet-profile-page';
import { PetsPage } from '../pages/pets-page';
import { SupportsPage } from '../pages/supports-page';
import { ReportsPage } from '../pages/reports-page';
import { TransparencyPage } from '../pages/transparency-page';
import { ProtectedRoute } from './protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'pets', element: <PetsPage /> },
      { path: 'pets/:slug', element: <PetProfilePage /> },
      { path: 'organizations/:slug', element: <OrganizationPage /> },
      { path: 'following', element: <FollowingPage /> },
      { path: 'apoios', element: <SupportsPage /> },
      { path: 'transparency', element: <TransparencyPage /> },
      { path: 'reports', element: <ReportsPage /> },
      {
        path: 'ngo/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['ngo_manager', 'temporary_home_manager']}>
            <NgoDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
