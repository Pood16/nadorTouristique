export const ROUTES = {
 
  HOME: '/',
  LOCATIONS: '/locations',
  LOCATION_DETAIL: (id: string) => `/locations/${id}`,
  EVENTS: '/events',


  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LOCATIONS: '/admin/locations',
  ADMIN_LOCATION_NEW: '/admin/locations/new',
  ADMIN_LOCATION_EDIT: (id: string) => `/admin/locations/${id}/edit`,
  ADMIN_SUBSCRIBERS: '/admin/subscribers',
  ADMIN_NEWSLETTER: '/admin/newsletter',
  ADMIN_EVENTS: '/admin/events',

  NOT_FOUND: '*',
} as const;
