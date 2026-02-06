# CAT Operating Portal

Enforced operating system for the Center for Advanced Techniques (CAT). A full-stack application for case management, module progression, compliance auditing, and incident reporting.

## Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Docker** and **Docker Compose** (for containerized setup)
- **PostgreSQL** (or use the included `docker-compose.yml`)

### Local Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Backend setup
cd backend
npm install
npx prisma migrate dev

# Frontend setup
cd ../frontend
npm install

# Start backend (port 3001)
cd ../backend
npm run start:dev

# Start frontend (port 3000) in another terminal
cd frontend
npm run dev
```

### Docker Setup

```bash
docker-compose up
```

Access the application at **http://localhost:3000**  
API docs at **http://localhost:3001/api**

## Project Structure

```
cat-operating-portal/
├── backend/          # NestJS API
│   ├── src/
│   ├── prisma/       # Database schema
│   └── Dockerfile
├── frontend/         # Next.js frontend
│   ├── app/
│   ├── components/
│   └── Dockerfile
├── openapi/          # OpenAPI specification
└── docker-compose.yml
```

## API

The API follows OpenAPI 3.1.0 specification. See `openapi/openapi.yaml` for full documentation.

Key endpoints:
- `POST /cases` - Create case
- `GET /cases` - List cases
- `POST /cases/{id}/advance` - Advance case to next module
- `POST /incidents` - Report incident
- `POST /audit` - Log audit action

## Environment Variables

See `.env.example` for available configuration options.

## Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## License

Proprietary - Center for Advanced Techniques
