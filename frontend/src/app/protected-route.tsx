import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth-store';
import type { UserRole } from '../types/domain';
import { canAccessNgoDashboard } from '../utils/access';

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate replace to="/" />;
  }

  if (allowedRoles?.includes('ngo_manager') || allowedRoles?.includes('temporary_home_manager')) {
    if (!canAccessNgoDashboard(currentUser) || !currentUser.organizationId) {
      return <Navigate replace to="/" />;
    }
  }

  return <>{children}</>;
}
