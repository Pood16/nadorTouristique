import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronLeft, ChevronRight, MapPin, Clock,
  Banknote, Bus, Car, Footprints, ParkingCircle, Ship, Bike,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchLocationById, clearCurrentLocation } from '@/store/slices/locationsSlice';
import { ROUTES } from '@/constants/routes';
import { getCategoryMeta } from '@/constants/categories';
import { CategoryBadge } from '@/components/common/Badge';
import { FullPageSpinner } from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import type { TransportOption, WeekHours } from '@/types';


const DAY_LABELS: Record<keyof WeekHours, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

const transportIcon: Record<string, React.ElementType> = {
  bus: Bus,
  taxi: Car,
  car: Car,
  parking: ParkingCircle,
  walk: Footprints,
  ferry: Ship,
  bike: Bike,
};

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentLocation: location, loading, error } = useAppSelector((s) => s.locations);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchLocationById(id));
    return () => { dispatch(clearCurrentLocation()); };
  }, [id, dispatch]);

  if (loading) return <FullPageSpinner />;

  if (error || !location) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <MapPin className="w-16 h-16 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">Lieu introuvable</h1>
        <p className="text-neutral-500 mb-6">{error ?? 'Ce lieu n\'existe pas ou a été supprimé.'}</p>
        <Link to={ROUTES.LOCATIONS}>
          <Button variant="primary">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const meta = getCategoryMeta(location.category);
  const images = location.images ?? [];
  const hasMultipleImages = images.length > 1;

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  return (
    <div className="bg-neutral-100 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-neutral-500 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <span className="text-neutral-300">/</span>
          <Link to={ROUTES.LOCATIONS} className="text-neutral-500 hover:text-primary-700 transition-colors">
            Lieux touristiques
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-700 font-medium truncate max-w-xs">{location.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left / Main ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-200 aspect-video shadow-md">
              {images.length > 0 ? (
                <img
                  src={images[imgIndex]}
                  alt={`${location.name} — photo ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <MapPin className="w-20 h-20" />
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Photo précédente"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Photo suivante"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        aria-label={`Photo ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Thumbnail strip */}
              {hasMultipleImages && (
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 hidden sm:flex gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  {meta && (
                    <CategoryBadge label={meta.label} color={meta.color} textColor={meta.textColor} />
                  )}
                  <h1 className="font-display text-3xl font-bold text-primary-900 mt-2">{location.name}</h1>
                </div>
              </div>
              <p className="text-neutral-600 leading-relaxed text-base">{location.description}</p>
            </div>

            {/* Opening Hours */}
            {location.hours && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-5 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  Horaires d&apos;ouverture
                </h2>
                <div className="divide-y divide-neutral-100">
                  {(Object.entries(location.hours) as [keyof WeekHours, { open: boolean; from: string; to: string }][]).map(
                    ([day, hours]) => (
                      <div key={day} className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-neutral-700 w-28">
                          {DAY_LABELS[day]}
                        </span>
                        {hours.open ? (
                          <span className="text-sm text-neutral-600">
                            {hours.from} – {hours.to}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400 italic">Fermé</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right / Sidebar ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Quick info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-neutral-900">Informations pratiques</h2>

              {location.address && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-0.5">Adresse</p>
                    <p className="text-sm text-neutral-700 leading-snug">{location.address}</p>
                  </div>
                </div>
              )}

              {location.pricing && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5 text-accent-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-0.5">Tarifs</p>
                    <p className="text-sm text-neutral-700 leading-snug">{location.pricing}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Transport */}
            {location.transport && location.transport.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Accès & Transport</h2>
                <div className="flex flex-col gap-4">
                  {location.transport.map((t: TransportOption, idx: number) => {
                    const Icon = transportIcon[t.type] ?? Car;
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-0.5 capitalize">
                            {t.type}
                          </p>
                          <p className="text-sm text-neutral-700 leading-snug">{t.details}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA back */}
            <div className="bg-primary-900 rounded-2xl p-6 text-white text-center">
              <p className="font-semibold mb-1">Vous avez visité ce lieu ?</p>
              <p className="text-primary-300 text-sm mb-4">
                Abonnez-vous à notre newsletter pour recevoir d&apos;autres recommandations.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                  navigate('/');
                }}
              >
                S&apos;abonner gratuitement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
