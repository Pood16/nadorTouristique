import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchLocations, setFilters } from '@/store/slices/locationsSlice';
import { CATEGORIES } from '@/constants/categories';
import type { LocationCategory } from '@/types';
import LocationCard from '@/components/common/LocationCard';
import EmptyState from '@/components/common/EmptyState';
import { FullPageSpinner } from '@/components/common/Spinner';
import { useDebounce } from '@/hooks/useDebounce';

export default function LocationsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((s) => s.locations);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 400);


  useEffect(() => {
    const catParam = searchParams.get('category') as LocationCategory | null;
    if (catParam && CATEGORIES.some((c) => c.value === catParam)) {
      dispatch(setFilters({ categories: [catParam] }));
    }
  }, []);


  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const sortField =
      filters.sortOrder === 'desc' ? `-${filters.sortBy}` : filters.sortBy;
    dispatch(
      fetchLocations({
        category: filters.categories.length === 1 ? filters.categories[0] : undefined,
        status: 'active',
        _sort: sortField,
      })
    );
  }, [dispatch, filters]);

  // locations
  const visibleItems = filters.search.trim()
    ? items.filter((loc) =>
        loc.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        loc.shortDescription.toLowerCase().includes(filters.search.toLowerCase())
      )
    : items;

  const clientTotal = visibleItems.length;
  const activeCategories = filters.categories;
  const hasActiveFilters = activeCategories.length > 0 || filters.search.trim() !== '';

  
  return (
    <div className="bg-neutral-100 min-h-screen">
    
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">
            Lieux touristiques
          </h1>
          <p className="text-neutral-500 text-lg">
            {clientTotal > 0
              ? `${clientTotal} lieu${clientTotal > 1 ? 'x' : ''} trouvé${clientTotal > 1 ? 's' : ''}`
              : 'Explorez Nador et ses environs'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-8">
          <div className="flex items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher un lieu…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-950 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-sm"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

           {/* cats */}
            <div className="flex items-center gap-2">
              <select
                value={activeCategories[0] ?? ''}
                onChange={(e) => {
                  const val = e.target.value as LocationCategory;
                  if (val) {
                    dispatch(setFilters({ categories: [val] }));
                    setSearchParams({ category: val });
                  } else {
                    dispatch(setFilters({ categories: [] }));
                    setSearchParams({});
                  }
                }}
                className="py-2.5 px-3 pr-8 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

       {/* search results */}
        {loading ? (
          <FullPageSpinner />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            title="Aucun lieu trouvé"
            description={
              hasActiveFilters
                ? 'Essayez de modifier ou réinitialiser vos filtres.'
                : 'Aucun lieu actif pour le moment.'
            }

          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
