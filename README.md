# Healthly - Health Tracking Application

A comprehensive health monitoring application built with React and Express that allows users to track daily health metrics including sleep, nutrition, exercise, hydration, and mood.

## Features

- **Health Tracking**: Daily metrics for sleep, nutrition, exercise, hydration, and mood
- **User Authentication**: Email/password authentication system
- **Data Visualization**: Charts and insights for health trends
- **Diary System**: Personal diary entries with mood tracking
- **Calendar View**: Monthly overview of health data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Radix UI with shadcn/ui components
- Tailwind CSS for styling
- TanStack Query for state management
- Wouter for routing
- Recharts for data visualization

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Session-based authentication
- RESTful API endpoints

## Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd healthly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.kwwhtilkkvhcnlxwaqos.supabase.co:5432/postgres

# Session Secret (generate a secure random string)
SESSION_SECRET=your-secure-session-secret-here
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t healthly .
```

2. Run the container:
```bash
docker run -p 5000:5000 \
  -e DATABASE_URL="your-database-url" \
  -e SESSION_SECRET="your-session-secret" \
  healthly
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables on your hosting platform:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for session encryption
   - `PORT`: (Optional) Port number (defaults to 5000)

3. Start the production server:
```bash
npm start
```

## Database Setup

The application uses PostgreSQL with Drizzle ORM. You can use any PostgreSQL provider:

- **Supabase**: Create a project and use the connection string
- **Neon**: Serverless PostgreSQL 
- **Railway**: PostgreSQL hosting
- **Self-hosted**: Your own PostgreSQL instance

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/               # Frontend React application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utility functions
├── server/               # Backend Express application
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   └── storage.ts        # Data storage interface
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── dist/                 # Built application (generated)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details