import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage';
import { FloorMapPage } from '@/pages/floor-map/FloorMapPage';
import { useAuth } from '@/features/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Navigate to="/floor-map" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/floor-map',
    element: (
      <ProtectedRoute>
        <FloorMapPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
