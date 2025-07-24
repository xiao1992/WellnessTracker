# Deployment Guide

This guide covers deploying the Healthly application to various hosting platforms.

## Quick Deployment Options

### 1. Railway
1. Connect your GitHub repository to Railway
2. Set environment variables:
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `SESSION_SECRET`
3. Deploy automatically

### 2. Render
1. Connect repository to Render
2. Create a PostgreSQL database
3. Set environment variables
4. Deploy as a Web Service

### 3. Vercel + Database
1. Deploy frontend to Vercel
2. Use Vercel Functions for API or separate backend on Railway
3. Connect to external PostgreSQL (Supabase, Neon, etc.)

### 4. Docker (Any Platform)
```bash
# Build and run locally
docker build -t healthly .
docker run -p 5000:5000 \
  -e DATABASE_URL="your-db-url" \
  -e SESSION_SECRET="your-secret" \
  healthly
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Random string for sessions | `abc123xyz789...` |
| `PORT` | Server port (optional) | `5000` |
| `NODE_ENV` | Environment | `production` |

## Database Providers

### Supabase (Currently Used)
Your project is already configured with Supabase:
- Database URL: `postgresql://postgres:password@db.kwwhtilkkvhcnlxwaqos.supabase.co:5432/postgres`
- Replace `password` with your actual Supabase database password
- Use the Transaction pooler connection string for better performance

### Neon
1. Create database at neon.tech
2. Copy connection string from dashboard
3. Use directly as `DATABASE_URL`

### Railway
1. Add PostgreSQL plugin to your Railway project
2. Use the provided `DATABASE_URL` variable

## Build Process

The application builds in two steps:
1. `vite build` - Builds the React frontend to `dist/public`
2. `esbuild` - Bundles the Express server to `dist/index.js`

## Health Checks

The application provides a health check endpoint:
- `GET /api/health` - Returns 200 if database is connected

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly formatted
- Check if SSL is required (most cloud databases do)
- Verify network access from your hosting platform

### Session Issues
- Ensure `SESSION_SECRET` is set and secure
- Use a random string of at least 32 characters

### Build Failures
- Ensure Node.js 20+ is used
- Run `npm ci` for clean dependency install
- Check TypeScript compilation with `npm run check`