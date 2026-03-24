import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-[120px] font-bold text-primary-300 leading-none select-none">404</p>
      <h1 className="font-display text-3xl font-bold text-primary-900">Page introuvable</h1>
      <p className="text-neutral-600 max-w-sm">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to={ROUTES.HOME}
        className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-all duration-200 shadow"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
