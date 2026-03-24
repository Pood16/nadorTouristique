import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchLocations } from '@/store/slices/locationsSlice';
import { ROUTES } from '@/constants/routes';
import LocationCard from '@/components/common/LocationCard';
import SubscribeForm from '@/components/common/SubscribeForm';
import Button from '@/components/common/Button';
import { FullPageSpinner } from '@/components/common/Spinner';



export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: locations, loading } = useAppSelector((s) => s.locations);

  useEffect(() => {
    dispatch(fetchLocations({ _per_page: 8, status: 'active' }));
  }, [dispatch]);

  return (
    <div className="bg-neutral-100">
      <section className="relative bg-primary-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold-300 mb-4">
              <span className="w-6 h-px bg-gold-300" />
              Région de l&apos;Oriental, Maroc
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Découvrez
              <span className="block text-primary-300">Nador</span>
              la Perle de la Méditerranée
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed mb-8 max-w-lg">
              Lagune de Marchica, plages de sable doré, Rif montagneux, souks animés…
              Explorez tout ce que Nador a à vous offrir.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={ROUTES.LOCATIONS}>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explorer les lieux
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:border-white"
                onClick={() => document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                S&apos;abonner
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { value: '12+', label: 'Lieux répertoriés' },
              { value: '9', label: 'Catégories' },
              { value: '100%', label: 'Gratuit & accessible' },
              { value: '∞', label: 'Souvenirs à créer' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <p className="font-display text-4xl font-bold text-white">{value}</p>
                <p className="text-primary-300 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Locations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-primary-900 mb-2">Lieux à découvrir</h2>
              <p className="text-neutral-500">Une sélection des incontournables de Nador</p>
            </div>
            <Link to={ROUTES.LOCATIONS} className="hidden sm:flex items-center gap-1 text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <FullPageSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center sm:hidden">
            <Link to={ROUTES.LOCATIONS}>
              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>Voir tous les lieux</Button>
            </Link>
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">
              Pourquoi Nador ?
            </span>
            <h2 className="font-display text-3xl font-bold text-primary-900 mb-5">
              Une destination méditerranéenne authentique
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Nador, capitale de la province du même nom dans la région de l&apos;Oriental, est une
              ville côtière marocaine adossée à la lagune de Marchica — la plus grande lagune du
              Maroc. Son cadre naturel exceptionnel, entre mer, montagne et désert, en fait une
              destination unique.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Cultures berbère et andalouse se mêlent dans l&apos;architecture, la gastronomie et les
              traditions locales, offrant aux visiteurs une immersion authentique dans l&apos;Oriental
              marocain.
            </p>
            <Link to={ROUTES.LOCATIONS}>
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>Découvrir les lieux</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800" alt="Lagune de Marchica" className="rounded-2xl object-cover h-48 w-full" />
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" alt="Plage de Nador" className="rounded-2xl object-cover h-48 w-full mt-6" />
            <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800" alt="Souk de Nador" className="rounded-2xl object-cover h-48 w-full -mt-6" />
            <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800" alt="Méditerranée" className="rounded-2xl object-cover h-48 w-full" />
          </div>
        </div>
      </section>


      <section id="newsletter-section" className="py-20 bg-primary-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Restez informé des événements à Nador
            </h2>
            <p className="font-thin text-white">
              Festivals, marchés, visites guidées, nouvelles adresses… Recevez les meilleures
              actualités de Nador directement dans votre boîte mail. Gratuit, sans spam.
            </p>
          </div>
          <SubscribeForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
