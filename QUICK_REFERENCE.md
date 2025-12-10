# Quick Reference Card

## Project: Visual-Based Note/Diary Taker

### Directory Layout
```
visual-note-taker/
├── frontend/          Vue.js 3 + Vite application
├── backend/           Node.js + Express server
├── docs/              Documentation (START HERE)
└── .github/           Development guidelines
```

### Start Development (5 minutes)

**Step 1: Setup Environment**
```bash
cd /Users/clement/Downloads/visual-note-taker
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
# Edit .env files with Supabase credentials
```

**Step 2: Install Dependencies**
```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

**Step 3: Run Servers (2 terminals)**
```bash
# Terminal 1
cd frontend && npm run dev

# Terminal 2
cd backend && npm run dev
```

**Step 4: Access Application**
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3000/health

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (both) |
| `npm run build` | Build for production (frontend) |
| `npm run lint` | Check code quality |
| `git add .` | Stage changes |
| `git commit -m ""` | Commit changes |
| `git push origin main` | Push to GitHub |

### Important Files to Know

| File | Purpose |
|------|---------|
| `docs/GETTING_STARTED.md` | Setup guide |
| `docs/IMPLEMENTATION_PLAN.md` | Development roadmap |
| `docs/DATABASE_SETUP.md` | Database schema |
| `docs/API_REFERENCE.md` | API endpoints |
| `frontend/src/App.vue` | Main app component |
| `backend/src/server.js` | Express app |
| `.env.local` / `.env` | Environment variables |

### Frontend Architecture

```
Frontend (Vue.js)
├── Pages (views)
│   ├── Dashboard (home)
│   ├── CategoryView (drill-down)
│   ├── ComparisonView (tree/tunnel)
│   ├── Analytics (metrics)
│   └── Settings (configuration)
├── Components (reusable)
│   └── [To be built]
├── Services (API calls)
│   ├── api.js (REST client)
│   └── supabase.js (Auth)
└── Stores (state)
    ├── userStore (user data)
    └── categoryStore (categories)
```

### Backend Architecture

```
Backend (Node.js)
├── Routes (endpoints)
│   ├── auth (login/register)
│   ├── categories (CRUD)
│   ├── notes (content)
│   ├── comparison (views)
│   ├── metrics (analytics)
│   ├── export (CSV/Excel)
│   ├── collaboration (sharing)
│   ├── backups (restore)
│   └── versions (history)
├── Middleware
│   ├── auth (verify tokens)
│   └── errorHandler (catch errors)
└── Services
    ├── supabase (DB client)
    ├── sizeCalculator (algorithm)
    ├── exportService (file export)
    └── backupService (scheduling)
```

### Database (Supabase)

7 Tables:
- `users` - User profiles
- `categories` - Hierarchical categories
- `notes` - Content
- `metrics` - Usage statistics
- `collaboration_shares` - Friend sharing
- `versions` - Change history
- `backups` - Backup records

### Features (MVP)

✅ Word cloud interface with dynamic sizing  
✅ Unlimited hierarchical nesting (lazy-loaded)  
✅ Tree & tunnel comparison views  
✅ 2D/3D navigation (mouse + scroll)  
✅ Time-tracking & 4D mode  
✅ Real-time collaboration  
✅ Analytics & metrics  
✅ CSV/Excel export  
✅ Automatic backups  

### Configuration

**Sizing Weights** (Default):
- Note count: 40%
- Edit frequency: 35%
- Manual adjustment: 25%

**Limits**:
- Max categories: 150 per user
- Max comparisons: 7 simultaneous
- Lazy-load depth: 10 levels

**Performance**:
- Target load time: < 2 seconds
- API response: < 200ms
- Real-time latency: < 500ms

### Development Phases

1. ✅ **Setup** - Project structure created
2. 📋 **Configuration** - Database setup (DATABASE_SETUP.md)
3. 🎨 **Word Cloud** - D3.js visualization
4. 📊 **Hierarchy** - Nested navigation
5. 🔄 **Comparison** - Tree & tunnel views
6. ⏱️ **Timeline** - 4D visualization
7. 👥 **Collaboration** - Friend sharing
8. 📈 **Analytics** - Metrics & export

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:3000 \| xargs kill -9` |
| DB connection fails | Check `.env` credentials |
| npm errors | `rm -rf node_modules && npm install` |
| CORS errors | Verify CORS_ORIGIN in backend `.env` |
| 404 routes | Check route registration in `server.js` |

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/word-cloud

# Make changes...

# Commit
git add .
git commit -m "feat: implement word cloud component"

# Push
git push origin feature/word-cloud

# Create PR on GitHub
```

### Documentation Links

- 📖 [Getting Started](docs/GETTING_STARTED.md)
- 🗺️ [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- 🗄️ [Database Setup](docs/DATABASE_SETUP.md)
- 📡 [API Reference](docs/API_REFERENCE.md)

### Useful URLs

- Supabase: https://supabase.com
- Vue.js: https://vuejs.org
- D3.js: https://d3js.org
- Node.js: https://nodejs.org
- Express: https://expressjs.com

### Environment Template

**frontend/.env.local:**
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_BASE_URL=http://localhost:3000/api
```

**backend/.env:**
```
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
SUPABASE_ANON_KEY=your_key
JWT_SECRET=random_secret
CORS_ORIGIN=http://localhost:5173
```

### Next Step

👉 **Read [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) now!**

---

**Project**: Visual-Based Note/Diary Taker  
**Location**: `/Users/clement/Downloads/visual-note-taker`  
**Status**: ✅ Ready to develop  
**Created**: December 10, 2025
