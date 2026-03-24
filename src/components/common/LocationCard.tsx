import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Location } from '@/types';
import { getCategoryMeta } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { CategoryBadge } from './Badge';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const meta = getCategoryMeta(location.category);
  const coverImage = location.images?.[0] ?? null;

  return (
    <Link
      to={ROUTES.LOCATION_DETAIL(location.id)}
      className="group block bg-white rounded-xl shadow overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 relative">
        {coverImage ? (
          <img
            src={coverImage}
            alt={location.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <MapPin className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {meta && (
          <CategoryBadge
            label={meta.label}
            color={meta.color}
            textColor={meta.textColor}
          />
        )}
        <h2 className="text-lg font-semibold text-neutral-950 mt-2 leading-snug line-clamp-1">
          {location.name}
        </h2>
        <p className="text-sm text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
          {location.shortDescription}
        </p>
        {location.address && (
          <p className="text-xs text-neutral-400 mt-3 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            {location.address}
          </p>
        )}
      </div>
    </Link>
  );
}
