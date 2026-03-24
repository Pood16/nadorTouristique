import type { LocationCategory } from '@/types';

export interface CategoryMeta {
  value: LocationCategory;
  label: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind bg class for badge
  textColor: string; // Tailwind text class for badge
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: 'beaches',
    label: 'Plages',
    icon: 'Waves',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    value: 'natural_sites',
    label: 'Sites Naturels',
    icon: 'Mountain',
    color: 'bg-green-100',
    textColor: 'text-green-700',
  },
  {
    value: 'monuments',
    label: 'Monuments et Patrimoine',
    icon: 'Landmark',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
  {
    value: 'museums',
    label: 'Musées et Culture',
    icon: 'Museum',
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  {
    value: 'restaurants',
    label: 'Restaurants',
    icon: 'UtensilsCrossed',
    color: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  {
    value: 'hotels',
    label: 'Hôtels et Hébergements',
    icon: 'BedDouble',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
  },
  {
    value: 'cafes',
    label: 'Cafés et Salons de Thé',
    icon: 'Coffee',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    value: 'shopping',
    label: 'Shopping et Souks',
    icon: 'ShoppingBag',
    color: 'bg-pink-100',
    textColor: 'text-pink-700',
  },
  {
    value: 'leisure',
    label: 'Loisirs et Divertissement',
    icon: 'Ferris-wheel',
    color: 'bg-teal-100',
    textColor: 'text-teal-700',
  },
];

export const getCategoryMeta = (value: LocationCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0];
