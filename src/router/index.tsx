import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import VisitorLayout from '@/components/layout/VisitorLayout';

// Visitor pages
import HomePage from '@/pages/visitor/HomePage';
import LocationsPage from '@/pages/visitor/LocationsPage';
import LocationDetailPage from '@/pages/visitor/LocationDetailPage';
import VisitorEventsPage from '@/pages/visitor/EventsPage';

// Admin pages
import LoginPage from '@/pages/admin/LoginPage';
import AdminLayout from '@/components/layout/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import LocationsListPage from '@/pages/admin/LocationsListPage';
import LocationFormPage from '@/pages/admin/LocationFormPage';
import SubscribersPage from '@/pages/admin/SubscribersPage';
import NewsletterPage from '@/pages/admin/NewsletterPage';
import EventsPage from '@/pages/admin/EventsPage';

import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  // ─── Visitor routes (with Navbar + Footer) ─────────────────────────────────
  {
    element: <VisitorLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/locations', element: <LocationsPage /> },
      { path: '/locations/:id', element: <LocationDetailPage /> },
      { path: '/events', element: <VisitorEventsPage /> },
    ],
  },

  // ─── Admin login ──────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: <LoginPage />,
  },

  // ─── Protected admin routes ───────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'locations', element: <LocationsListPage /> },
      { path: 'locations/new', element: <LocationFormPage /> },
      { path: 'locations/:id/edit', element: <LocationFormPage /> },
      { path: 'subscribers', element: <SubscribersPage /> },
      { path: 'newsletter', element: <NewsletterPage /> },
      { path: 'events', element: <EventsPage /> },
    ],
  },

  // ─── 404 ─────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
