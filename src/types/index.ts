export type LocationCategory =
  | 'beaches'
  | 'natural_sites'
  | 'monuments'
  | 'museums'
  | 'restaurants'
  | 'hotels'
  | 'cafes'
  | 'shopping'
  | 'leisure';

export type LocationStatus = 'active' | 'inactive';

export interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

export interface WeekHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface TransportOption {
  type: 'bus' | 'taxi' | 'car' | 'parking' | 'walk' | 'ferry';
  details: string;
}

export interface Location {
  id: number;
  name: string;
  category: LocationCategory;
  shortDescription: string;
  description: string;
  images: string[];
  hours?: WeekHours;
  pricing?: string;
  address?: string;
  transport?: TransportOption[];
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
}

export type LocationFormData = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;

export type SubscriberStatus = 'active' | 'inactive';

export interface Subscriber {
  id: number;
  firstName: string;
  email: string;
  subscribedAt: string;
  status: SubscriberStatus;
}

export type SubscribeFormData = Pick<Subscriber, 'firstName' | 'email'>;

export type EventStatus = 'active' | 'inactive';

export interface AppEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: EventStatus;
  createdAt: string;
}

export type EventFormData = Omit<AppEvent, 'id' | 'createdAt'>;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}


export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}


export interface LocationFilters {
  search: string;
  categories: LocationCategory[];
  status?: LocationStatus | '';
  sortBy: 'name' | 'category' | 'createdAt' | 'status';
  sortOrder: 'asc' | 'desc';
}
