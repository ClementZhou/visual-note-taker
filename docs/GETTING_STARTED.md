# Getting Started Guide

## Quick Setup (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (free at [supabase.com](https://supabase.com))

### 2. Initial Setup

```bash
# Clone or navigate to project directory
cd visual-note-taker

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 3. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000/api
```

**Backend** (`backend/.env`):
```
NODE_ENV=development
PORT=3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

JWT_SECRET=your-jwt-secret-key

BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 0 1 * *"

CORS_ORIGIN=http://localhost:5173
```

### 4. Set Up Supabase Database

1. Go to your Supabase project SQL editor
2. Copy and execute the SQL from [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)
3. Wait for tables to be created

### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Server running at http://localhost:3000
```

### 6. Verify Setup

- Frontend: Navigate to http://localhost:5173
- Backend: Check http://localhost:3000/health
- You should see `{"status":"ok","timestamp":"..."}`

---

## Project Structure

```
visual-note-taker/
├── docs/
│   ├── IMPLEMENTATION_PLAN.md    # Complete development roadmap
│   ├── DATABASE_SETUP.md         # Database schema & configuration
│   ├── API_REFERENCE.md          # API endpoints documentation
│   └── GETTING_STARTED.md        # This file
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable Vue components
│   │   ├── pages/                # Page components (Dashboard, Settings, etc.)
│   │   ├── services/             # API & Supabase clients
│   │   ├── stores/               # Pinia state management
│   │   ├── App.vue               # Root component
│   │   ├── main.js               # Entry point
│   │   ├── router.js             # Vue Router config
│   │   └── style.css             # Global styles
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── package.json              # Frontend dependencies
│   └── README.md                 # Frontend documentation
├── backend/
│   ├── src/
│   │   ├── routes/               # API route handlers
│   │   ├── middleware/           # Express middleware
│   │   ├── services/             # Business logic & utilities
│   │   ├── config/               # Configuration files
│   │   └── server.js             # Express server setup
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Example environment variables
│   └── README.md                 # Backend documentation
├── .github/
│   └── copilot-instructions.md  # Development guidelines
├── .gitignore                    # Git ignore patterns
└── README.md                     # Project overview
```

---

## Development Workflow

### Adding Frontend Components

1. Create Vue component in `frontend/src/components/`
2. Import and use in page components (`frontend/src/pages/`)
3. Use Pinia stores for state management
4. Call backend API via `api.js` service

Example:
```vue
<template>
  <div class="word-cloud">
    <!-- Your component template -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/services/api'

const categories = ref([])

const loadCategories = async () => {
  const { data } = await apiClient.get('/categories')
  categories.value = data.categories
}
</script>
```

### Adding Backend Routes

1. Create route handler in `backend/src/routes/`
2. Import in `backend/src/server.js`
3. Register route: `app.use('/api/route-name', routeHandler)`

Example:
```javascript
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ data: 'response' })
})

export default router
```

### Adding Services

Create business logic in `backend/src/services/`:
- `sizeCalculator.js` - Category sizing algorithm
- `exportService.js` - CSV/Excel export
- `backupService.js` - Backup scheduling
- `supabase.js` - Database client

---

## Key Features to Implement (Phase 2+)

### Phase 2: Word Cloud Engine
- [ ] D3.js word cloud layout component
- [ ] Category sizing algorithm calculation
- [ ] Manual size adjustment UI
- [ ] Responsive rendering

### Phase 3: Hierarchical Navigation
- [ ] Breadcrumb trail component
- [ ] Expand/collapse controls
- [ ] Lazy-loading beyond depth 10
- [ ] Quick-jump navigation

### Phase 4: Comparison Views
- [ ] Tree visualization (D3)
- [ ] Tunnel visualization (D3)
- [ ] Comparison toggle UI
- [ ] 3D navigation (mouse drag, scroll zoom)

### Phase 5: Time-Tracking & 4D Mode
- [ ] Timestamp tracking
- [ ] Version history browser
- [ ] Temporal slider
- [ ] 4D visualization

### Phase 6: Collaboration
- [ ] Friend management UI
- [ ] Permission-based sharing
- [ ] Real-time notifications (Supabase Realtime)
- [ ] Activity feed

### Phase 7: Analytics & Export
- [ ] Pie chart components
- [ ] Metrics dashboard
- [ ] CSV/Excel export
- [ ] Import parser

---

## Useful Commands

### Frontend
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
```

### Backend
```bash
cd backend
npm install        # Install dependencies
npm run dev        # Start dev server with watch
npm start          # Start production server
npm run lint       # Lint code
```

### Git
```bash
git add .                           # Stage changes
git commit -m "message"             # Commit changes
git push origin main                # Push to GitHub
git branch feature/name              # Create feature branch
git checkout feature/name            # Switch branch
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Supabase Connection Issues
- Verify credentials in `.env` files
- Check Supabase project URL format
- Ensure API keys are not expired
- Check browser console for CORS errors

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
- Check Supabase dashboard for table creation status
- Verify RLS policies are enabled
- Check database size limits (free tier: 500MB)

---

## Next Steps

1. ✅ **Project initialized** - Basic structure in place
2. 📋 **Configure Supabase** - Set up database (see DATABASE_SETUP.md)
3. 🔧 **Install dependencies** - `npm install` in frontend and backend
4. 🚀 **Start dev servers** - Run both frontend and backend
5. 👨‍💻 **Begin Phase 2** - Implement word cloud engine

---

## Documentation Links

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) - Full development roadmap
- [Database Setup](docs/DATABASE_SETUP.md) - Schema and configuration
- [API Reference](docs/API_REFERENCE.md) - All endpoints documented
- [Frontend README](frontend/README.md) - Frontend-specific docs
- [Backend README](backend/README.md) - Backend-specific docs

---

## Support

For issues or questions:
1. Check the relevant documentation
2. Review error messages in console/logs
3. Check Supabase dashboard for database issues
4. Verify environment variables are set correctly

---

**Last Updated:** December 10, 2025  
**Project Version:** 1.0 MVP (Setup Phase)
