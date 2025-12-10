# Visual-Based Note/Diary Taker - Implementation Plan

**Version:** 1.0  
**Date:** December 10, 2025  
**Status:** In Development

## Project Overview

Build a fully-featured MVP combining visual word cloud interface, unlimited hierarchical nesting with lazy-loading beyond depth 10, automatic/manual sizing with user-configurable weights, dual-mode comparison views (tree & tunnel), 2D-3D navigation via mouse/scroll, time-tracking, collaboration, and analytics.

**Tech Stack:**
- Frontend: Vue.js + D3.js
- Backend: Node.js
- Database: Supabase (PostgreSQL)
- Max Categories: 150 per user
- Max Simultaneous Comparisons: 7

---

## MVP Scope

### Core Features (All Included in MVP)

#### 1. Visual Word Cloud Interface
- **Dynamic box-sizing**: Automatic calculation based on hybrid algorithm + manual adjustment
- **Layout engine**: Force-simulation D3 layout respecting 150-category limit
- **Responsive rendering**: Smooth animations and resize transitions
- **Size calculation**: `size = (note_count × 0.4) + (edit_frequency × 0.35) + (user_manual × 0.25)`

#### 2. Hierarchical Navigation
- **Unlimited nesting depth** with lazy-loading beyond depth 10
- Drill-down UI with breadcrumb trail
- Expand/collapse controls
- Quick-jump navigation for deep layers
- Virtual scrolling for wide sibling lists

#### 3. Dual-Mode Comparison Views
- **Tree visualization**: D3 hierarchical layout for structural comparison
- **Tunnel visualization**: Radial/perspective 2D abstraction for timeline/evolution
- **Tab-based UI**: Toggle between tree and tunnel views
- **3D Navigation controls**: Mouse drag for rotation, scroll for zoom
- **7 max simultaneous comparisons**

#### 4. Time-Tracking & 4D Mode
- Creation/modification timestamps on all nodes
- Yearly backup scheduling via Node.js cron jobs
- Version history browser
- Temporal slider for category evolution visualization

#### 5. Collaboration & Social Features
- User authentication via Supabase Auth
- Friend profiles and management
- Permission-based sharing (view-only) with Supabase RLS
- Real-time notifications via Supabase Realtime
- Activity feed and last-updated timestamps

#### 6. Analytics & Export
- Pie charts per category (D3)
- Metric tracking: update frequency, size history
- Report generation
- CSV/Excel export (structure + notes + sources)
- Import parser for data restoration

---

## Architecture & Technical Decisions

### Data Model (Supabase)
```
Tables:
- users (auth via Supabase Auth)
- categories (recursive with parent_id, unlimited depth)
- notes (content linked to categories)
- timestamps (creation_date, modification_date, last_accessed)
- collaboration_shares (user_id, shared_with_id, permission_level)
- metrics (category_id, edit_count, volume, last_modified)
- versions (history of changes for version control)
- backups (yearly backup metadata)
```

### Sizing Algorithm (Hybrid Approach)
**Default Weights:**
- `note_count`: 0.4 (40%)
- `edit_frequency`: 0.35 (35%)
- `user_manual`: 0.25 (25%)

**User Configurable:** Yes. Weights can be adjusted in settings with real-time recalculation and smooth transitions.

### Lazy-Loading Strategy
- Load hierarchy up to depth 10 on initial category open
- Beyond depth 10: Load children on-demand (expand click)
- Cache loaded subtrees
- Implement virtual scrolling for wide sibling lists

### Comparison View Modes
- **Both coexist**: Users can toggle between tree and tunnel, or view side-by-side
- **Interaction model**: Mouse drag = rotation, scroll = zoom
- **Support for 7 simultaneous comparisons** with distinct colors/identifiers

---

## Implementation Roadmap

### Phase 1: Project Setup & Core Infrastructure
- [ ] Initialize Git repository
- [ ] Set up frontend (Vue.js + Vite)
- [ ] Set up backend (Node.js + Express)
- [ ] Configure Supabase database and auth
- [ ] Create API endpoints scaffolding
- [ ] Set up CI/CD pipeline (optional for MVP)

### Phase 2: Visual Word Cloud Engine
- [ ] Implement D3.js word cloud layout
- [ ] Build Vue component for word cloud rendering
- [ ] Create sizing algorithm (automatic + manual adjustment)
- [ ] Add category CRUD operations
- [ ] Implement 150-category limit validation

### Phase 3: Hierarchical Navigation
- [ ] Create recursive category data structure
- [ ] Build drill-down UI with breadcrumb trail
- [ ] Implement expand/collapse controls
- [ ] Add lazy-loading beyond depth 10
- [ ] Create virtual scrolling for large sibling lists

### Phase 4: Comparison Views (Tree & Tunnel)
- [ ] Build tree visualization component (D3)
- [ ] Build tunnel visualization component (D3)
- [ ] Implement tab-based toggle UI
- [ ] Add 3D navigation controls (mouse drag, scroll)
- [ ] Support 7 max simultaneous comparisons
- [ ] Implement color coding for multiple comparisons

### Phase 5: Time-Tracking & 4D Mode
- [ ] Add timestamp tracking to all nodes
- [ ] Implement yearly backup scheduling (Node.js cron)
- [ ] Build version history browser
- [ ] Create temporal slider component
- [ ] Implement 4D visualization (evolution over time)

### Phase 6: Collaboration & Social Layer
- [ ] Set up Supabase Auth integration
- [ ] Create user profile management
- [ ] Build friend invitation system
- [ ] Implement permission-based sharing (RLS)
- [ ] Add real-time notifications (Supabase Realtime)
- [ ] Create activity feed

### Phase 7: Analytics & Export
- [ ] Implement pie chart components (D3)
- [ ] Build metric tracking system
- [ ] Create report generation functionality
- [ ] Implement CSV/Excel export (xlsx library)
- [ ] Build import parser
- [ ] Add analytics dashboard

### Phase 8: Testing, Optimization & Deployment
- [ ] Unit tests for core components
- [ ] Integration tests for API endpoints
- [ ] Performance optimization (lazy-loading, caching)
- [ ] Mobile/cross-browser testing
- [ ] Security audit and hardening
- [ ] Deploy to production

---

## API Endpoints (Backend)

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Categories
- `GET /categories` - Get all user categories
- `POST /categories` - Create new category
- `GET /categories/:id` - Get category details
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/:id/children` - Get child categories (with lazy-loading)

### Notes
- `GET /notes/:categoryId` - Get notes for category
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Comparison Views
- `GET /compare` - Get comparison data for multiple categories
- `GET /compare/tree/:ids` - Get tree view data
- `GET /compare/tunnel/:ids` - Get tunnel view data

### Metrics & Analytics
- `GET /metrics/:categoryId` - Get category metrics
- `GET /analytics/report` - Generate analytics report

### Export/Import
- `POST /export/csv` - Export as CSV
- `POST /export/excel` - Export as Excel
- `POST /import` - Import from file

### Collaboration
- `POST /friends/invite` - Send friend invitation
- `GET /friends` - Get friend list
- `GET /friends/:id/categories` - Get friend's shared categories
- `POST /share` - Share category with friend

### Backups
- `GET /backups` - Get backup history
- `POST /backups` - Trigger manual backup
- `GET /backups/:id/restore` - Restore from backup

### Versions
- `GET /versions/:categoryId` - Get version history
- `POST /versions/:id/restore` - Restore to specific version

---

## Database Schema

### users
```sql
id (uuid, PK)
email (varchar, unique)
username (varchar, unique)
created_at (timestamp)
updated_at (timestamp)
settings (jsonb)
```

### categories
```sql
id (uuid, PK)
user_id (uuid, FK to users)
name (varchar)
parent_id (uuid, FK to categories, nullable)
description (text)
created_at (timestamp)
modified_at (timestamp)
manual_size_factor (float, default 1.0)
color (varchar, optional)
depth_cached (integer, for optimization)
```

### notes
```sql
id (uuid, PK)
category_id (uuid, FK to categories)
title (varchar)
content (text)
source (text)
created_at (timestamp)
modified_at (timestamp)
```

### metrics
```sql
id (uuid, PK)
category_id (uuid, FK to categories)
edit_count (integer)
content_volume (integer)
last_modified (timestamp)
```

### collaboration_shares
```sql
id (uuid, PK)
user_id (uuid, FK to users)
shared_with_id (uuid, FK to users)
category_id (uuid, FK to categories)
permission_level (varchar: 'view', 'comment')
created_at (timestamp)
```

### versions
```sql
id (uuid, PK)
category_id (uuid, FK to categories)
version_number (integer)
snapshot (jsonb)
created_at (timestamp)
created_by (uuid, FK to users)
```

### backups
```sql
id (uuid, PK)
user_id (uuid, FK to users)
backup_date (timestamp)
file_path (varchar)
file_size (integer)
status (varchar: 'completed', 'failed')
```

---

## Frontend File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WordCloud.vue
│   │   ├── CategoryDrilldown.vue
│   │   ├── TreeComparison.vue
│   │   ├── TunnelComparison.vue
│   │   ├── ComparisonToggle.vue
│   │   ├── TemporalSlider.vue
│   │   ├── PieChart.vue
│   │   ├── UserProfile.vue
│   │   ├── FriendsList.vue
│   │   └── Analytics.vue
│   ├── pages/
│   │   ├── Dashboard.vue
│   │   ├── CategoryView.vue
│   │   ├── ComparisonView.vue
│   │   ├── Analytics.vue
│   │   ├── Settings.vue
│   │   └── Profile.vue
│   ├── services/
│   │   ├── api.js
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   └── d3-utils.js
│   ├── stores/
│   │   ├── userStore.js
│   │   ├── categoryStore.js
│   │   └── comparisonStore.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

---

## Backend File Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── notes.js
│   │   ├── comparison.js
│   │   ├── metrics.js
│   │   ├── export.js
│   │   ├── collaboration.js
│   │   ├── backups.js
│   │   └── versions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── sizeCalculator.js
│   │   ├── exportService.js
│   │   └── backupService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── config/
│   │   └── env.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

---

## Key Implementation Notes

1. **Supabase RLS (Row-Level Security)**: Implement policies to ensure users can only access their own data and shared categories from friends.

2. **Real-time Updates**: Use Supabase Realtime to push collaborative updates instantly.

3. **Performance**: Lazy-load categories beyond depth 10 and implement virtual scrolling to handle large datasets.

4. **User Weights**: Store user's sizing weights in Supabase and allow real-time recalculation.

5. **Yearly Backups**: Use Node.js `node-cron` to schedule automatic yearly backups to Supabase storage or external cloud.

6. **Export Formats**: Use `xlsx` library for Excel export and `csv-stringify` for CSV export.

---

## Success Criteria

- [ ] All features listed in MVP Scope are functional
- [ ] Application loads in < 2 seconds
- [ ] Hierarchical nesting works with unlimited depth (lazy-loaded beyond 10)
- [ ] Comparison views (tree & tunnel) render correctly for 7 simultaneous categories
- [ ] Collaboration features work in real-time
- [ ] Data exports successfully to CSV and Excel
- [ ] Yearly backups are automated
- [ ] Mobile responsive and cross-browser compatible

---

## Next Steps

1. Initialize frontend with Vue.js + Vite
2. Initialize backend with Node.js + Express
3. Configure Supabase project and database
4. Create initial Git commits for project structure
5. Begin Phase 1 implementation
