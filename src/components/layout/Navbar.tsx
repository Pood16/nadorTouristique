import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, MapPin, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/common/Button';
import { useAppSelector } from '@/hooks/useAppSelector';

const navLinks = [
  { label: 'Accueil', to: ROUTES.HOME },
  { label: 'Lieux touristiques', to: ROUTES.LOCATIONS },
  { label: 'Événements', to: ROUTES.EVENTS },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-primary-900 hover:text-primary-700 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Nador Guide
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.HOME}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 pb-0.5 ${
                  isActive
                    ? 'text-primary-700 border-b-2 border-primary-500'
                    : 'text-neutral-600 hover:text-primary-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && (
            <Link to={ROUTES.ADMIN_DASHBOARD}>
              <Button variant="outline" size="sm">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const el = document.getElementById('newsletter');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            S&apos;abonner
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-primary-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === ROUTES.HOME}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
            {isAuthenticated && (
              <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('newsletter');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              S&apos;abonner à la newsletter
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
