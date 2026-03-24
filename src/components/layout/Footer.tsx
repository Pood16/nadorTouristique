import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes';
import { CATEGORIES } from '@/constants/categories';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addSubscriber } from '@/store/slices/subscribersSlice';
import { toast } from 'react-toastify';

const quickLinks = [
  { label: 'Accueil', to: ROUTES.HOME },
  { label: 'Lieux touristiques', to: ROUTES.LOCATIONS },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter (X)', href: '#' },
];

// Show first 5 categories in footer
const footerCategories = CATEGORIES.slice(0, 5);

export default function Footer() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    setLoading(true);
    try {
      await dispatch(addSubscriber({ email, firstName })).unwrap();
      toast.success('Inscription réussie ! Bienvenue 🎉');
      setEmail('');
      setFirstName('');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </span>
              <span className="font-display text-xl font-bold">Nador Guide</span>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6">
              La perle de la Méditerranée marocaine — votre guide touristique de référence pour
              Nador et ses environs.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    'w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center',
                    'hover:bg-primary-500 transition-colors duration-150'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2 — Quick links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-primary-300 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-neutral-300 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-primary-300 mb-4">
              Catégories
            </h3>
            <ul className="space-y-2">
              {footerCategories.map((cat) => (
                <li key={cat.value}>
                  <Link
                    to={`${ROUTES.LOCATIONS}?category=${cat.value}`}
                    className="text-sm text-neutral-300 hover:text-white transition-colors duration-150"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 — Newsletter */}
          <div id="newsletter">
            <h3 className="font-semibold text-sm uppercase tracking-widest text-primary-300 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Newsletter
            </h3>
            <p className="text-sm text-primary-300 mb-4">
              Recevez les dernières actualités et événements de Nador directement dans votre boîte mail.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={cn(
                  'px-3 py-2 rounded-lg text-sm text-neutral-950',
                  'bg-white placeholder:text-neutral-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 border-0'
                )}
              />
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  'px-3 py-2 rounded-lg text-sm text-neutral-950',
                  'bg-white placeholder:text-neutral-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 border-0'
                )}
              />
              <Button type="submit" variant="primary" size="sm" loading={loading}>
                S&apos;abonner
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-700 mt-2 pt-6 text-center text-xs text-primary-300">
          © {new Date().getFullYear()} Nador Guide — Région de l&apos;Oriental, Maroc. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
