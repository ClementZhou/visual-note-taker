# Database Setup Guide

## Overview
Visual Note Taker uses Supabase (PostgreSQL) as the database. This guide covers schema setup and configuration.

## Prerequisites
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys
3. Add them to your `.env` and `.env.local` files

## Database Schema

### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);
```

### 2. categories (Hierarchical)
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  modified_at TIMESTAMP DEFAULT NOW(),
  manual_size_factor DECIMAL(3,2) DEFAULT 1.0,
  color VARCHAR(7),
  depth_cached INTEGER,
  CONSTRAINT unique_category_per_user UNIQUE(user_id, parent_id, name)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

### 3. notes
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  modified_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_category_id ON notes(category_id);
```

### 4. metrics
```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  edit_count INTEGER DEFAULT 0,
  content_volume INTEGER DEFAULT 0,
  last_modified TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_metric_per_category UNIQUE(category_id)
);

CREATE INDEX idx_metrics_category_id ON metrics(category_id);
```

### 5. collaboration_shares
```sql
CREATE TABLE collaboration_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  permission_level VARCHAR(20) DEFAULT 'view',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_share UNIQUE(user_id, shared_with_id, category_id),
  CONSTRAINT no_self_share CHECK(user_id != shared_with_id)
);

CREATE INDEX idx_shares_user_id ON collaboration_shares(user_id);
CREATE INDEX idx_shares_shared_with_id ON collaboration_shares(shared_with_id);
```

### 6. versions (Change History)
```sql
CREATE TABLE versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT unique_version UNIQUE(category_id, version_number)
);

CREATE INDEX idx_versions_category_id ON versions(category_id);
```

### 7. backups
```sql
CREATE TABLE backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  backup_date TIMESTAMP NOT NULL,
  file_path VARCHAR(255),
  file_size INTEGER,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_backups_user_id ON backups(user_id);
```

## Row-Level Security (RLS)

Enable RLS on all tables and set up policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Users: Users can only see their own data
CREATE POLICY "Users can see their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Categories: Users can see their own categories + shared ones
CREATE POLICY "Users can see their categories" ON categories
  FOR SELECT USING (
    user_id = auth.uid() OR
    id IN (
      SELECT category_id FROM collaboration_shares 
      WHERE shared_with_id = auth.uid()
    )
  );

-- Categories: Users can only modify their own
CREATE POLICY "Users can modify their categories" ON categories
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create categories" ON categories
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notes: Inherit category permissions
CREATE POLICY "Users can see notes in accessible categories" ON notes
  FOR SELECT USING (
    category_id IN (
      SELECT id FROM categories WHERE user_id = auth.uid()
      UNION
      SELECT category_id FROM collaboration_shares WHERE shared_with_id = auth.uid()
    )
  );
```

## Setup Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and API keys

2. **Run Schema SQL**
   - In Supabase SQL Editor, execute the schema queries above
   - Alternatively, use migrations if your project supports them

3. **Configure Environment**
   ```bash
   # Backend .env
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   
   # Frontend .env.local
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Enable Features**
   - Enable Auth in Supabase dashboard
   - Configure sign-up settings (email only recommended)
   - Set up Realtime for real-time subscriptions
   - Configure storage if backup files will be stored

5. **Test Connection**
   ```bash
   npm run dev
   # Navigate to http://localhost:5173/health
   # Should see { status: 'ok' }
   ```

## Backup Configuration

Enable point-in-time recovery in Supabase:
- Go to Project Settings > Database > Backups
- Enable automated backups
- Set retention period (recommended: 30 days)

## Performance Tuning

- Add indices for frequently queried columns
- Use `EXPLAIN ANALYZE` to identify slow queries
- Monitor database size and connection usage
- Set up alerts for high resource usage

## Next Steps

1. Verify all tables are created and accessible
2. Test RLS policies work correctly
3. Configure Supabase Auth settings
4. Set up automated backups
5. Begin implementing API endpoints

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
