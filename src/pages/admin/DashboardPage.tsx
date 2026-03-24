import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Users, CalendarDays, PlusCircle,
  Send, TrendingUp, CheckCircle, XCircle,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchLocations } from '@/store/slices/locationsSlice';
import { fetchSubscribers } from '@/store/slices/subscribersSlice';
import { fetchEvents } from '@/store/slices/eventsSlice';
import { CATEGORIES } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items: locations, pagination } = useAppSelector((s) => s.locations);
  const { items: subscribers } = useAppSelector((s) => s.subscribers);
  const { items: events } = useAppSelector((s) => s.events);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchLocations({ _per_page: 100 }));
    dispatch(fetchSubscribers());
    dispatch(fetchEvents());
  }, [dispatch]);

  const totalLocations = pagination.total || locations.length;
  const activeLocations = locations.filter((l) => l.status === 'active').length;
  const inactiveLocations = locations.filter((l) => l.status === 'inactive').length;
  const activeSubscribers = subscribers.filter((s) => s.status === 'active').length;
  const activeEvents = events.filter((e) => e.status === 'active').length;

  
  const categoryBreakdown = CATEGORIES.map((cat) => ({
    ...cat,
    count: locations.filter((l) => l.category === cat.value).length,
  })).filter((c) => c.count > 0);


  const recentLocations = [...locations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-950">Tableau de bord</h1>
          <p className="text-neutral-500 mt-1">
            Bonjour, {user?.firstName ?? 'Admin'} 👋
          </p>
        </div>
        <Link to={ROUTES.ADMIN_LOCATION_NEW}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Nouveau lieu
          </Button>
        </Link>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MapPin className="w-6 h-6" />}
          label="Lieux total"
          value={totalLocations}
          subValue={`${activeLocations} actifs · ${inactiveLocations} inactifs`}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Abonnés actifs"
          value={activeSubscribers}
          subValue={`${subscribers.length} au total`}
          iconBgClass="bg-accent-100"
          iconTextClass="text-accent-700"
        />
        <StatCard
          icon={<CalendarDays className="w-6 h-6" />}
          label="Événements actifs"
          value={activeEvents}
          subValue={`${events.length} au total`}
          iconBgClass="bg-secondary-100"
          iconTextClass="text-secondary-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Taux d'activation"
          value={totalLocations ? `${Math.round((activeLocations / totalLocations) * 100)}%` : '—'}
          subValue="lieux actifs"
          iconBgClass="bg-gold-300/20"
          iconTextClass="text-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Répartition par catégorie</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucune donnée</p>
          ) : (
            <div className="flex flex-col gap-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.value} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color.replace('bg-', 'bg-')}`} />
                  <span className="text-sm text-neutral-700 flex-1 truncate">{cat.label}</span>
                  <span className="text-sm font-semibold text-neutral-900">{cat.count}</span>
                  <div className="w-20 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${(cat.count / totalLocations) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* locations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900">Derniers lieux ajoutés</h2>
            <Link to={ROUTES.ADMIN_LOCATIONS} className="text-xs text-primary-700 font-semibold hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentLocations.map((loc) => (
              <div key={loc.id} className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                  {loc.images?.[0] ? (
                    <img src={loc.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">{loc.name}</p>
                  <p className="text-xs text-neutral-400 truncate">{loc.category}</p>
                </div>
                <Badge variant={loc.status === 'active' ? 'active' : 'inactive'} dot>
                  {loc.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            ))}
            {recentLocations.length === 0 && (
              <p className="text-sm text-neutral-400 py-4">Aucun lieu enregistré.</p>
            )}
          </div>
        </div>
      </div>
       {/* Status legend */}
       <div className="mt-6 flex items-center gap-4 text-xs text-neutral-400">
         <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent-500" /> Actif : visible sur le site</span>
         <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-neutral-400" /> Inactif : masqué des visiteurs</span>
       </div>
    </div>
  );
}
