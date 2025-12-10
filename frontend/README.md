# Visual Note Taker - Frontend

Vue.js 3 + D3.js frontend application for Visual Note Taker, providing an interactive visual note-taking experience.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

3. Add your Supabase credentials and API configuration

4. Start the development server:
```bash
npm run dev
```

App will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/      # Vue components
├── pages/           # Page components
├── services/        # API and utility services
├── stores/          # Pinia state management
├── style.css        # Global styles
├── App.vue          # Root component
└── main.js          # Entry point
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code

## Key Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **D3.js** - Data visualization library
- **Pinia** - State management
- **Supabase JS** - Backend integration

## Features

- Visual word cloud interface
- Hierarchical category navigation
- Dual-mode comparison views (tree & tunnel)
- Time-based tracking and 4D visualization
- Real-time collaboration
- Analytics and charts

## Environment Variables

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_BASE_URL` - Backend API base URL

## Components To Build

### Phase 1
- WordCloud.vue - Main word cloud visualization
- CategoryDrilldown.vue - Hierarchical navigation

### Phase 2
- TreeComparison.vue - Tree-based comparison view
- TunnelComparison.vue - Tunnel-based comparison view

### Phase 3
- TemporalSlider.vue - Timeline navigation
- PieChart.vue - Analytics visualization

### Phase 4
- UserProfile.vue - User management
- FriendsList.vue - Collaboration features

## Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Next Steps

1. Set up Supabase credentials
2. Implement core store modules (userStore, categoryStore)
3. Build main dashboard page
4. Create word cloud component with D3.js
5. Implement category hierarchy navigation
