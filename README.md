# SpringFileKeeper Frontend

Vue 3 + Vite + Tailwind CSS file management application.

## Features

- **Search & Filter**: Search files by title, filename, or metadata with real-time suggestions
- **Category Filters**: Filter files by category (Document, Image, Video, Audio, Archive, Code, Other)
- **Sortable Table**: Click column headers to sort results
- **Pagination**: Navigate through large result sets
- **Authentication**: Login/logout with session persistence
- **Mock API**: Development-ready with 200 fake records
- **Responsive Design**: Mobile-friendly Tailwind CSS styling

## Project Structure

```
src/
├── api/
│   ├── index.js              # API mode switcher
│   ├── filesApi.js           # API interface contract
│   ├── mockFilesApi.js       # Mock implementation (200 fake records)
│   └── httpFilesApi.js       # Real backend implementation
├── stores/
│   ├── authStore.js          # Pinia auth store
│   └── searchStore.js        # Pinia search store
├── components/
│   ├── TopBar.vue            # App header with login/logout
│   ├── SearchBar.vue         # Search input with suggestions
│   ├── CategoryFilters.vue   # Category checkboxes
│   ├── ResultsTable.vue      # Sortable results table
│   ├── Pagination.vue        # Page navigation
│   └── LoginModal.vue        # Login modal dialog
├── pages/
│   ├── HomePage.vue          # Main search page
│   └── UploadPage.vue        # Upload placeholder
├── models/
│   └── fileModels.js         # Data models and constants
└── router/
    └── index.js              # Vue Router config
```

## Setup

```bash
# Install dependencies
npm install

# Start development server (with mock API)
npm run dev

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm build
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Mode: 'mock' or 'http'
VITE_API_MODE=mock

# API Base URL (only used when VITE_API_MODE=http)
VITE_API_BASE_URL=http://localhost:8080
```

## Using Mock API

By default, the app uses mock data with 200 deterministic fake records. This is perfect for development without a backend.

```bash
# Set in .env or leave as default
VITE_API_MODE=mock
```

The mock API:
- Generates 200 fake file records
- Supports full search, filter, sort, and pagination
- Provides search suggestions
- Accepts any email/password for login

## Switching to Real Backend

When your backend is ready:

1. Update `.env`:
```env
VITE_API_MODE=http
VITE_API_BASE_URL=http://localhost:8080
```

2. Ensure your backend implements these endpoints:
   - `GET /api/search` - Search files
   - `GET /api/search/suggest` - Get suggestions
   - `POST /api/auth/login` - Login
   - `POST /api/auth/logout` - Logout
   - `GET /api/auth/me` - Get current user

## Testing

### Unit Tests (Vitest)
```bash
npm test
```

Tests the search store logic including:
- Category filtering
- Sorting
- Pagination
- API integration

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

Tests full user workflows:
- Load page with results
- Type query and see suggestions
- Search on Enter key
- Filter by category
- Sort by column
- Navigate pages
- Open login modal

## Routes

- `/` - Home page with search and results
- `/upload` - Upload page (placeholder)

## Technologies

- **Vue 3** - Progressive framework
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible components
- **Vitest** - Unit testing
- **Playwright** - E2E testing
