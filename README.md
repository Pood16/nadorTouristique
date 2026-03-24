# Nador Touristique

A tourism guide web application for **Nador**, the Pearl of the Mediterranean — a coastal city in northeastern Morocco's Oriental region. The app helps visitors discover the best places to visit, upcoming events, and local highlights, while providing an admin panel for content management.

---

## Features

### Visitor-facing
- **Home page** — hero section showcasing Nador, featured locations, and a newsletter sign-up
- **Locations** — browse and filter tourist spots (beaches, natural sites, monuments, museums, restaurants, hotels, cafés, shopping, leisure)
- **Location detail** — full description, photo gallery, opening hours, pricing, address and transport options
- **Events** — list of upcoming local events with dates and descriptions

### Admin panel (`/admin`)
- **Dashboard** — key statistics at a glance
- **Location management** — create, edit, and toggle the status of tourist locations
- **Event management** — add and manage local events
- **Subscribers** — view newsletter subscribers
- **Newsletter** — compose and send newsletters to subscribers
- **Authentication** — JWT-based login with protected routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vite.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) |
| HTTP client | [Axios](https://axios-http.com/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [React Toastify](https://fkhadra.github.io/react-toastify/) |
| Email | [EmailJS](https://www.emailjs.com/) |
| Mock API | [json-server](https://github.com/typicode/json-server) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Pood16/nadorTouristique.git
cd nadorTouristique

# 2. Install dependencies
npm install
```

### Environment variables

Create a `.env` file at the project root (copy `.env` if it already exists) and set:

```env
VITE_API_URL=http://localhost:3001
```

### Running locally

Open **two terminals**:

```bash
# Terminal 1 — start the mock JSON API (port 3001)
npm run json-server

# Terminal 2 — start the Vite dev server (port 5173)
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Admin access

Navigate to [http://localhost:5173/admin/login](http://localhost:5173/admin/login) and log in with the credentials stored in `db/db.json`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run json-server` | Start the json-server mock API on port 3001 |

---

## Project Structure

```
src/
├── components/
│   ├── common/       # Reusable UI components (Button, LocationCard, SubscribeForm, …)
│   └── layout/       # VisitorLayout and AdminLayout wrappers
├── constants/        # Route constants and location category metadata
├── hooks/            # Typed Redux hooks (useAppDispatch, useAppSelector)
├── pages/
│   ├── visitor/      # Home, Locations, LocationDetail, Events
│   └── admin/        # Dashboard, LocationsList, LocationForm, Subscribers, Newsletter, Events, Login
├── router/           # React Router configuration and ProtectedRoute
├── services/         # Axios API service modules (locations, events, subscribers, newsletter, auth)
├── store/            # Redux store and feature slices
├── types/            # Shared TypeScript interfaces and types
└── utils/            # Utility helpers
db/
└── db.json           # json-server mock database (locations, events, subscribers, users)
```

---

## Location Categories

| Category | Description |
|---|---|
| Beaches | Golden-sand beaches along the Mediterranean |
| Natural Sites | Marchica Lagoon and Rif mountain landscapes |
| Monuments & Heritage | Historic sites and architectural landmarks |
| Museums & Culture | Cultural institutions and galleries |
| Restaurants | Local and international dining |
| Hotels & Accommodation | Places to stay |
| Cafés & Tea Rooms | Coffee shops and tea houses |
| Shopping & Souks | Markets, souks and retail areas |
| Leisure & Entertainment | Activities and entertainment venues |
