import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, ToggleLeft, ToggleRight, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchLocations, toggleLocationStatus, deleteLocation,
  setFilters, resetFilters, setPage,
} from '@/store/slices/locationsSlice';
import { ROUTES } from '@/constants/routes';
import { CATEGORIES } from '@/constants/categories';
import type { Location, LocationCategory } from '@/types';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { FullPageSpinner } from '@/components/common/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 10;

export default function LocationsListPage() {
  const dispatch = useAppDispatch();
  const { items, loading, pagination, filters } = useAppSelector((s) => s.locations);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [catFilter, setCatFilter] = useState<LocationCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [confirm, setConfirm] = useState<{ type: 'delete' | 'toggle'; location: Location } | null>(null);

  const isSearching = debouncedSearch.trim().length >= 1;

  useEffect(() => {
    dispatch(fetchLocations({
      category: catFilter || undefined,
      status: statusFilter || undefined,
      ...(isSearching ? {} : { _page: pagination.page, _per_page: PAGE_SIZE }),
      _sort: '-createdAt',
    }));
  }, [dispatch, debouncedSearch, catFilter, statusFilter, pagination.page, isSearching]);

  const visibleItems = isSearching
    ? items.filter((l) => l.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : items;
  const totalPages = Math.ceil(
    (isSearching ? visibleItems.length : pagination.total) / PAGE_SIZE
  );
  const pagedItems = isSearching
    ? visibleItems.slice((pagination.page - 1) * PAGE_SIZE, pagination.page * PAGE_SIZE)
    : visibleItems;

  const handleToggle = async (loc: Location) => {
    const newStatus = loc.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(toggleLocationStatus({ id: loc.id, status: newStatus })).unwrap();
      toast.success(`Lieu ${newStatus === 'active' ? 'activé' : 'désactivé'}.`);
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Erreur.'); }
    setConfirm(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteLocation(id)).unwrap();
      toast.success('Lieu supprimé.');
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Erreur.'); }
    setConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-950">Gestion des lieux</h1>
        <Link to={ROUTES.ADMIN_LOCATION_NEW}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Nouveau lieu
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un lieu…"
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); dispatch(setFilters({ search: e.target.value })); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {localSearch && (
            <button onClick={() => { setLocalSearch(''); dispatch(resetFilters()); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value as LocationCategory | ''); dispatch(setPage(1)); }}
          className="px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as 'active' | 'inactive' | ''); dispatch(setPage(1)); }}
          className="px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <FullPageSpinner />
      ) : pagedItems.length === 0 ? (
        <EmptyState title="Aucun lieu trouvé" description="Modifiez vos filtres ou ajoutez un nouveau lieu." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Lieu</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Statut</th>
                  <th className="text-right px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((loc) => {
                  const catMeta = CATEGORIES.find((c) => c.value === loc.category);
                  return (
                    <tr key={loc.id} className="border-t border-neutral-100 hover:bg-primary-100/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                            {loc.images?.[0]
                              ? <img src={loc.images[0]} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-neutral-200" />}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{loc.name}</p>
                            <p className="text-xs text-neutral-400 md:hidden">{catMeta?.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-neutral-600">{catMeta?.label ?? loc.category}</td>
                      <td className="px-4 py-4">
                        <Badge variant={loc.status === 'active' ? 'active' : 'inactive'}>
                          {loc.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={ROUTES.ADMIN_LOCATION_EDIT(loc.id)}>
                            <Button variant="icon" aria-label="Modifier">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="icon"
                            aria-label={loc.status === 'active' ? 'Désactiver' : 'Activer'}
                            onClick={() => setConfirm({ type: 'toggle', location: loc })}
                            className={cn(loc.status === 'active' ? 'hover:text-secondary-700' : 'hover:text-accent-700')}
                          >
                            {loc.status === 'active'
                              ? <ToggleRight className="w-5 h-5 text-accent-500" />
                              : <ToggleLeft className="w-5 h-5 text-neutral-400" />}
                          </Button>
                          <Button
                            variant="icon"
                            aria-label="Supprimer"
                            className="hover:text-secondary-700"
                            onClick={() => setConfirm({ type: 'delete', location: loc })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={totalPages}
        onPageChange={(p) => dispatch(setPage(p))}
        className="mt-6"
      />

      {/* Confirm modals */}
      {confirm?.type === 'delete' && (
        <ConfirmModal
          open
          title="Supprimer le lieu"
          message={`Êtes-vous sûr de vouloir supprimer « ${confirm.location.name} » ? Cette action est irréversible.`}
          variant="danger"
          confirmLabel="Supprimer"
          onConfirm={() => handleDelete(confirm.location.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'toggle' && (
        <ConfirmModal
          open
          title={confirm.location.status === 'active' ? 'Désactiver le lieu' : 'Activer le lieu'}
          message={`${confirm.location.status === 'active' ? 'Masquer' : 'Rendre visible'} « ${confirm.location.name} » pour les visiteurs ?`}
          variant={confirm.location.status === 'active' ? 'danger' : 'primary'}
          confirmLabel={confirm.location.status === 'active' ? 'Désactiver' : 'Activer'}
          onConfirm={() => handleToggle(confirm.location)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
