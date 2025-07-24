# Healthly Application

## Overview

Healthly is a full-stack health monitoring application built with React and Express that allows users to track daily health metrics including sleep, nutrition, exercise, hydration, and mood. The application provides a comprehensive dashboard with data visualization, insights, and calendar-based tracking with Apple Health-inspired design.

## User Preferences

Preferred communication style: Simple, everyday language.
App name: "Healthly" (changed from Pulse)
Design style: Apple Health-inspired with clean, modern interface
Metric measurements: Real-world units (hours for sleep, glasses for hydration, etc.)
Scoring system: Discrete 10-point intervals (90, 100, etc. - no scores in between)
Nutrition focus: Veggies/good protein instead of fruits/veggies
Navigation: Separate views for trends and calendar accessed via bottom navigation
Authentication: User login/signup system for data separation

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Connection**: Neon serverless PostgreSQL
- **API**: RESTful endpoints for health data CRUD operations
- **Development**: Hot reload with Vite integration

### Build System
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Strict type checking across the entire codebase
- **ESModule**: Modern module system throughout

## Key Components

### Database Schema
- **health_entries table**: Stores daily health metrics with columns for:
  - `id`: Primary key
  - `date`: Date of the health entry
  - `sleepScore`, `nutritionScore`, `exerciseScore`, `hydrationScore`, `moodScore`: Individual metric scores (0-100)
  - `overallScore`: Calculated average of all metrics
  - `createdAt`, `updatedAt`: Timestamps

### API Endpoints
- `GET /api/health-entries/:date`: Retrieve health entry for specific date
- `GET /api/health-entries`: Retrieve health entries with optional date range
- `POST /api/health-entries`: Create or update health entry

### Frontend Components
- **HealthScoreOverview**: Displays circular progress chart of overall health score
- **MetricInput**: Interactive sliders for inputting health metrics with real-world measurements
- **CalendarView**: Monthly calendar showing health scores for each day
- **ProgressCharts**: Line and bar charts for trend analysis
- **InsightsSection**: AI-like insights based on user data patterns
- **BottomNavigation**: Mobile navigation with functional scroll-to-section behavior

### Storage Layer
- **IStorage Interface**: Abstract storage interface for flexibility
- **MemStorage**: In-memory storage implementation for development
- **Database Storage**: PostgreSQL implementation via Drizzle ORM

## Data Flow

1. **User Input**: Users interact with metric input sliders to record daily health data
2. **Form Validation**: Zod schemas validate input data (scores must be 0-100)
3. **API Request**: TanStack Query manages API calls to Express backend
4. **Data Processing**: Backend calculates overall score and handles create/update logic
5. **Database Storage**: Drizzle ORM manages PostgreSQL operations
6. **Real-time Updates**: Query client automatically updates UI with fresh data
7. **Data Visualization**: Charts and insights render based on stored data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **recharts**: Data visualization
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **drizzle-kit**: Database schema management and migrations
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon serverless PostgreSQL with environment-based configuration
- **API Development**: Express server with request logging and error handling

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database Migrations**: Drizzle Kit handles schema changes
- **Environment Variables**: `DATABASE_URL` required for database connection

### Key Features
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Real-time Data**: Automatic UI updates when data changes
- **Data Persistence**: PostgreSQL ensures data reliability
- **Type Safety**: End-to-end TypeScript for better developer experience
- **Accessibility**: Radix UI components provide ARIA compliance
- **Performance**: Optimized builds and efficient query patterns
- **Real-world Measurements**: Sleep in hours, hydration in glasses/oz, exercise in minutes, etc.
- **Interactive Navigation**: Functional bottom navigation with smooth scrolling

## Recent Changes
- Changed app name from "Pulse" to "Healthly"
- Updated nutrition metric to "Veggies & Good Protein" instead of fruits/vegetables
- Implemented discrete scoring system (10-point intervals: 0, 10, 20, 30, etc.)
- Separated trends and calendar into dedicated page views
- **MAJOR:** Implemented email/password authentication system (July 14, 2025)
  - Replaced Replit OAuth with traditional email/password authentication
  - Users can register with email, password, and optional first/last name
  - Added secure password hashing using Node.js crypto scrypt
  - Implemented session-based authentication with connect-pg-simple
  - Added comprehensive login/registration forms with validation
  - All health data remains protected and user-specific
- Restructured home page to show only health overview and metric input
- Created separate routes for /trends, /calendar, and /profile
- Enhanced bottom navigation to navigate between actual pages instead of scrolling
- **MAJOR:** Migrated to Supabase PostgreSQL database (July 23, 2025)
  - Successfully migrated from Neon to Supabase for better scalability
  - Updated database configuration to use Supabase connection string
  - Fixed form validation issues preventing health data submission
  - Optimized database connection settings for stability
  - Cleaned up debug code and Replit-specific processing for production readiness
  - All functionality working: authentication, health tracking, data visualization
- **SECURITY:** Implemented proper credential protection (July 23, 2025)
  - Enhanced .gitignore to prevent environment variable leaks
  - Created .env.example template for secure setup
  - Added comprehensive README.md with setup instructions
  - Documented security practices for production deployment
  - Removed sensitive placeholder data from repository
- **FEATURE:** Diary Entry System (July 23, 2025)
  - Moved health trends content to calendar page below the calendar view
  - Replaced trends page with comprehensive diary entry functionality
  - Users can write, edit, and delete personal diary entries with optional titles and mood tags
  - Added diary_entries database table with full CRUD API endpoints
  - Updated bottom navigation to reflect "Diary" instead of "Trends"
  - Enhanced user experience with mood-based color coding and rich text support
- **DEPLOYMENT:** External Deployment Preparation (July 23, 2025)
  - Removed Replit-specific configurations and dependencies
  - Updated server to use flexible PORT environment variable (defaults to 5000)
  - Made database configuration generic for any PostgreSQL provider
  - Created Dockerfile and .dockerignore for containerized deployment
  - Added comprehensive README.md with setup and deployment instructions
  - Created deploy.md guide for various hosting platforms (Railway, Render, Vercel)
  - Enhanced .env template with examples for multiple database providers
  - Fixed bottom navigation layout issues with proper z-index and responsive design

The application follows a modern full-stack architecture with clear separation of concerns, type safety, and responsive design principles to provide a seamless health tracking experience.