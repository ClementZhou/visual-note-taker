# Visual Note Taker - Backend

Node.js + Express backend server for Visual Note Taker application, integrated with Supabase for database and authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your Supabase credentials and configuration

4. Start the development server:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Project Structure

```
src/
├── routes/          # API endpoint handlers
├── middleware/      # Express middleware
├── services/        # Business logic
├── config/          # Configuration files
├── utils/           # Helper functions
└── server.js        # Main server file
```

## Development

- `npm run dev` - Start with watch mode
- `npm start` - Start production server
- `npm run lint` - Lint and fix code

## API Documentation

See [API_REFERENCE.md](../docs/API_REFERENCE.md) for complete endpoint documentation.

## Database

Supabase PostgreSQL database. See [DATABASE_SETUP.md](../docs/DATABASE_SETUP.md) for schema and migrations.

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - JWT secret for token signing
- `CORS_ORIGIN` - CORS origin URL
- `BACKUP_ENABLED` - Enable automatic backups
- `BACKUP_SCHEDULE` - Cron schedule for backups

## Features

- User authentication via Supabase Auth
- RESTful API for all app features
- Real-time data sync
- Automatic backups
- Data export/import
- Collaboration features
- Analytics and metrics

## Next Steps

Implement routes for:
1. Authentication (/auth)
2. Categories management (/categories)
3. Notes management (/notes)
4. Comparison views (/comparison)
5. Analytics (/metrics)
6. Export/Import (/export)
7. Collaboration (/collaboration)
