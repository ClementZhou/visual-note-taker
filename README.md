# Visual-Based Note/Diary Taker

A modern, visual note-taking application with hierarchical organization, time-tracking, collaboration features, and advanced analytics. Combines a dynamic word cloud interface with unlimited nesting depth, dual-mode comparison views (tree & tunnel), and real-time collaboration.

## Features

- **Visual Word Cloud Interface**: Dynamic category boxes that resize based on importance and usage frequency
- **Unlimited Hierarchical Nesting**: Drill down infinitely with lazy-loading beyond depth 10
- **Dual Comparison Views**: Tree visualization for structure, tunnel visualization for evolution
- **Time-Tracking & 4D Mode**: View how your notes evolve over time with version history
- **Real-Time Collaboration**: Share categories with friends, see live updates
- **Advanced Analytics**: Pie charts, metrics tracking, and report generation
- **Smart Export/Import**: CSV and Excel export with full data preservation
- **Automatic Backups**: Yearly backups with version control

## Tech Stack

- **Frontend**: Vue.js 3 + D3.js + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd visual-note-taker
```

2. **Set up Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

3. **Set up Backend**
```bash
cd ../backend
npm install
cp .env.example .env
# Add your Supabase and configuration credentials to .env
npm run dev
```

4. **Configure Supabase**
- Create a new Supabase project
- Run database migrations (see `docs/DATABASE_SETUP.md`)
- Add Supabase URL and API keys to both frontend and backend `.env` files

### Running Locally

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

Frontend will be available at `http://localhost:5173`
Backend API at `http://localhost:3000`

## Project Structure

```
visual-note-taker/
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   ├── DATABASE_SETUP.md
│   ├── API_REFERENCE.md
│   └── USER_GUIDE.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   └── App.vue
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Documentation

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) - Detailed development roadmap
- [Database Setup](docs/DATABASE_SETUP.md) - Schema and Supabase configuration
- [API Reference](docs/API_REFERENCE.md) - Backend endpoints documentation
- [User Guide](docs/USER_GUIDE.md) - How to use the application

## Development Roadmap

### Phase 1: Project Setup & Core Infrastructure ✓
### Phase 2: Visual Word Cloud Engine (In Progress)
### Phase 3: Hierarchical Navigation
### Phase 4: Comparison Views (Tree & Tunnel)
### Phase 5: Time-Tracking & 4D Mode
### Phase 6: Collaboration & Social Layer
### Phase 7: Analytics & Export
### Phase 8: Testing, Optimization & Deployment

## Configuration

### Environment Variables

**Frontend** (`.env.local`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend** (`.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=development
PORT=3000
```

## Key Decisions

- **Sizing Algorithm**: Hybrid approach with default weights (note_count: 0.4, edit_frequency: 0.35, user_manual: 0.25)
- **Lazy-Loading**: Categories load up to depth 10, then on-demand beyond
- **Category Limit**: 150 max categories per user
- **Comparisons**: Support up to 7 simultaneous category comparisons
- **Backup Strategy**: Automated yearly backups with manual backup option

## API Endpoints

See [API_REFERENCE.md](docs/API_REFERENCE.md) for complete endpoint documentation.

Quick overview:
- **Auth**: `/auth/register`, `/auth/login`
- **Categories**: `/categories`, `/categories/:id`
- **Comparison**: `/compare`, `/compare/tree/:ids`, `/compare/tunnel/:ids`
- **Export**: `/export/csv`, `/export/excel`
- **Collaboration**: `/friends/invite`, `/share`

## Contributing

Contributions welcome! Please follow these steps:
1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -m 'Add feature'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Review implementation plan for development status

## Status

**Current Phase**: Project Setup & Core Infrastructure  
**Last Updated**: December 10, 2025  
**Version**: 1.0 MVP (In Development)
