import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Mail,
  CalendarDays,
  LogOut
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, to: ROUTES.ADMIN_DASHBOARD },
  { label: 'Lieux', icon: MapPin, to: ROUTES.ADMIN_LOCATIONS },
  { label: 'Abonnés', icon: Users, to: ROUTES.ADMIN_SUBSCRIBERS },
  { label: 'Newsletter', icon: Mail, to: ROUTES.ADMIN_NEWSLETTER },
  { label: 'Événements', icon: CalendarDays, to: ROUTES.ADMIN_EVENTS },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-body">
      <aside
        className="fixed top-0 left-0 h-full z-40 flex flex-col bg-neutral-800 shadow-xl transition-all duration-300"
      >

        <div className="h-16 bg-primary-900 flex items-center px-6 shrink-0">
          <span className="font-display text-xl font-bold text-white tracking-wide">
            Nador Guide
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p className="text-xs uppercase tracking-widest text-neutral-500 px-4 mt-2 mb-3">
            Navigation
          </p>
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm transition-colors duration-100',
                  isActive
                    ? 'bg-primary-700 text-white font-semibold'
                    : 'text-neutral-300 hover:bg-primary-700 hover:text-white'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

  
        <div className="shrink-0 px-3 py-4 border-t border-neutral-700">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold">
                {user.firstName?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                <p className="text-neutral-400 text-xs truncate">{user.username}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-red-700/40 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main
        className={cn(
          'pt-3 min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
