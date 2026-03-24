import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchSubscribers, toggleSubscriberStatus } from '@/store/slices/subscribersSlice';
import type { Subscriber } from '@/types';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { FullPageSpinner } from '@/components/common/Spinner';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export default function SubscribersPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.subscribers);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

  const activeCount = items.filter((s) => s.status === 'active').length;

  const handleToggle = async (sub: Subscriber) => {
    setToggling(sub.id);
    const next = sub.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(toggleSubscriberStatus({ id: sub.id, status: next })).unwrap();
      toast.success(`Abonné ${next === 'active' ? 'activé' : 'désactivé'}.`);
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Erreur.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-950">Abonnés Newsletter</h1>
        <div className="flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-lg text-sm font-medium">
          <Users className="w-4 h-4" />
          <span>{activeCount} abonné{activeCount !== 1 ? 's' : ''} actif{activeCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {loading ? (
        <FullPageSpinner />
      ) : items.length === 0 ? (
        <EmptyState title="Aucun abonné" description="Les inscriptions depuis le site apparaîtront ici." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Prénom</th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold hidden sm:table-cell">Inscrit le</th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Statut</th>
                  <th className="text-right px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((sub) => (
                  <tr key={sub.id} className="border-t border-neutral-100 hover:bg-primary-50/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{sub.firstName}</td>
                    <td className="px-6 py-4 text-neutral-600">{sub.email}</td>
                    <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{formatDate(sub.subscribedAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={sub.status === 'active' ? 'active' : 'inactive'}>
                        {sub.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="icon"
                        aria-label={sub.status === 'active' ? 'Désactiver' : 'Activer'}
                        isLoading={toggling === sub.id}
                        onClick={() => handleToggle(sub)}
                      >
                        {sub.status === 'active'
                          ? <ToggleRight className="w-5 h-5 text-accent-500" />
                          : <ToggleLeft className="w-5 h-5 text-neutral-400" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
