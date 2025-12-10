# Visual Note Taker - Development Instructions

## Project Overview
Full-stack visual note-taking application with hierarchical organization, real-time collaboration, and advanced analytics. Built with Vue.js + D3.js frontend, Node.js backend, and Supabase database.

## Tech Stack
- **Frontend**: Vue.js 3 + D3.js + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Authentication

## Project Structure
```
visual-note-taker/
├── docs/               # Documentation
├── frontend/           # Vue.js application
├── backend/            # Node.js server
└── README.md          # Main documentation
```

## Development Setup

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Add Supabase credentials to .env.local
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add Supabase credentials and config to .env
npm run dev
```

## Key Features
1. **Visual Word Cloud Interface** - Dynamic category boxes with D3.js
2. **Unlimited Hierarchical Nesting** - Drill-down with lazy-loading beyond depth 10
3. **Dual Comparison Views** - Tree visualization and tunnel visualization
4. **Time-Tracking & 4D Mode** - Version history and temporal visualization
5. **Real-Time Collaboration** - Friend sharing with Supabase Realtime
6. **Analytics & Export** - Pie charts, metrics, CSV/Excel export

## Implementation Phases
1. ✓ Project Setup & Core Infrastructure
2. Visual Word Cloud Engine (Next)
3. Hierarchical Navigation
4. Comparison Views (Tree & Tunnel)
5. Time-Tracking & 4D Mode
6. Collaboration & Social Layer
7. Analytics & Export
8. Testing, Optimization & Deployment

## Important Decisions
- **Sizing**: Automatic (40% note_count, 35% edit_frequency, 25% manual) + manual adjustment
- **Nesting**: Unlimited depth with lazy-loading beyond depth 10
- **Categories**: Max 150 per user
- **Comparisons**: Up to 7 simultaneous
- **Interaction**: Mouse drag for rotation, scroll for zoom
- **Comparison Modes**: Both tree and tunnel coexist with toggle UI

## API Architecture
- Base URL: `/api` (proxied to http://localhost:3000)
- Authentication: Supabase Auth tokens
- Response Format: JSON with error handling

## Database Schema
See [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md#database-schema) for complete schema details.

Key tables:
- `users` - User profiles and authentication
- `categories` - Hierarchical categories with recursive parent_id
- `notes` - Content linked to categories
- `metrics` - Tracking usage frequency and volume
- `collaboration_shares` - Friend permissions
- `versions` - Change history
- `backups` - Yearly backups

## Coding Standards
- Use Vue 3 Composition API for components
- Use Pinia for state management
- Use D3.js for all visualizations
- Follow ESLint configuration
- Add error handling to all API calls
- Document complex algorithms (e.g., sizing calculation)

## Supabase Configuration
- Enable Row-Level Security (RLS) for all tables
- Set up auth policies for user data isolation
- Configure Realtime subscriptions for collaboration
- Enable point-in-time recovery for backups
- Set up cloud storage for backup files

## Next Development Tasks
1. Set up Supabase project with database migrations
2. Implement authentication routes and middleware
3. Create category CRUD API endpoints
4. Build word cloud component with D3.js
5. Implement sizing algorithm service

## Documentation
- [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) - Detailed roadmap
- [README.md](README.md) - Project overview
- Frontend [README.md](frontend/README.md)
- Backend [README.md](backend/README.md)

## Performance Targets
- Initial load: < 2 seconds
- API response time: < 200ms
- Real-time collaboration: < 500ms latency
- Large hierarchies (depth 20+): Use lazy-loading to prevent lag

## Testing Strategy
- Unit tests for services
- Integration tests for API endpoints
- Component tests for Vue components
- E2E tests for user workflows
- Performance testing for large datasets

## Deployment
- Frontend: Build and deploy dist/ to static hosting (Vercel, Netlify, etc.)
- Backend: Deploy to Node.js hosting (Railway, Render, Heroku, etc.)
- Database: Managed Supabase project

## Current Status
- Phase 1: Complete (project structure, configuration)
- Phase 2: In Progress (word cloud engine)
- Last Updated: December 10, 2025
