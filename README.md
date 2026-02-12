# FinXpert

A comprehensive financial advisory platform built with NestJS and Next.js.

## Features

- **Client Management**: Complete client lifecycle management
- **Portfolio Tracking**: Real-time portfolio analytics and insights
- **Loan Management**: Loan application tracking and optimization
- **Insurance**: Gap analysis and product recommendations
- **Goals Planning**: Goal-based financial planning with SIP recommendations
- **CRM**: Client interactions, tasks, and campaign management
- **AI Integration**: Google Gemini-powered insights and recommendations
- **Document Management**: Cloudinary-based document storage
- **Bank Statement Import**: AI-powered transaction parsing from PDF/Excel

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Cloudinary** - Document storage
- **Google Gemini** - AI integration

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 20.x
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Seed the database (optional):
```bash
npm run prisma:seed
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`
API documentation available at `http://localhost:3001/api/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd finxpert-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finxpert"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
BSE_STAR_API_KEY="your-broker-api-key" # Optional
BSE_STAR_API_SECRET="your-broker-api-secret" # Optional
FRONTEND_URL="http://localhost:3000"
```

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd finxpert-frontend

# Lint
npm run lint

# Build
npm run build
```

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs backend unit and e2e tests
- Runs frontend linting and build
- Performs security audits
- Uses PostgreSQL service container for testing

## Project Structure

```
finxpert/
├── backend/
│   ├── src/
│   │   ├── advisors/       # Advisor management
│   │   ├── clients/         # Client management
│   │   ├── portfolios/     # Portfolio tracking
│   │   ├── loans/           # Loan management
│   │   ├── goals/           # Goals planning
│   │   ├── crm/             # CRM features
│   │   ├── ai/              # AI integration
│   │   ├── broker/          # Broker integration
│   │   ├── documents/       # Document management
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── test/                # E2E tests
│
└── finxpert-frontend/
    ├── app/
    │   ├── (dashboard)/     # Dashboard routes
    │   ├── clients/         # Client pages
    │   ├── components/      # React components
    │   └── ...
    └── lib/                 # Utilities and API client
```

## API Documentation

Once the backend is running, visit `http://localhost:3001/api/docs` for interactive Swagger documentation.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

UNLICENSED
