# Ecco MCP Platform

**Open-source platform for Model Context Protocol (MCP) deployments**

Ecco is like Vercel for MCP services - deploy MCP hosts, clients, and servers with managed hosting. Build, deploy, and scale your MCP applications with enterprise-grade infrastructure.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🚀 Features

- **MCP Service Management** - Deploy and manage MCP hosts, clients, and servers
- **Project Workspaces** - Organize your MCP services in collaborative projects
- **Modern Stack** - Built with Bun, TypeScript, and cutting-edge tooling
- **Container-First** - Kubernetes-ready with Docker and multi-stage builds
- **Type-Safe Database** - Drizzle ORM with full TypeScript integration
- **Developer Experience** - Hot reload, instant migrations, and comprehensive tooling

## 🏗️ Architecture

**Monorepo Structure:**
```
├── apps/
│   └── api/                 # Hono-based API service
├── packages/
│   ├── core/               # Shared utilities and types
│   └── postgres/           # Database layer with Drizzle ORM
└── docker-compose.yml     # Development environment
```

**Tech Stack:**
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- **Monorepo**: [Turborepo](https://turbo.build) - High-performance build system
- **API Framework**: [Hono](https://hono.dev) - Lightweight, fast web framework
- **Database**: [PostgreSQL](https://postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Caching**: [Redis](https://redis.io) for sessions and background jobs
- **Container**: [Docker](https://docker.com) with multi-stage builds
- **Language**: [TypeScript](https://typescriptlang.org) throughout

## 🚦 Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.2.19
- [Docker](https://docker.com) and Docker Compose
- [Direnv](https://direnv.net) (recommended for environment management)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/your-org/ecco.git
   cd ecco
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .envrc file
   cat > .envrc << EOF
   export API_PORT=3000
   export DATABASE_URL=postgresql://ecco:ecco-dev-password@localhost:5432/ecco
   export NODE_ENV=development
   export REDIS_URL=redis://localhost:6379
   EOF
   
   # Allow direnv to load environment
   direnv allow .
   ```

3. **Start the development environment:**
   ```bash
   # Start PostgreSQL, Redis, and DbGate
   bun run docker:up
   
   # Create database tables
   bun run db:push:force
   
   # Seed with test data
   bun run db:seed
   
   # Start the API server
   bun run dev
   ```

4. **Verify everything is working:**
   ```bash
   curl http://localhost:3000          # API health check
   open http://localhost:8080          # Database GUI (DbGate)
   ```

## 📋 Development Workflow

### Database Management

```bash
# Schema changes (rapid development)
bun run db:push:force     # Sync schema changes instantly
bun run db:seed           # Add test data

# Production migrations
bun run db:generate       # Generate migration files
bun run db:migrate        # Apply migrations

# Database tools
bun run db:studio         # Launch Drizzle Studio
```

### Docker Operations

```bash
# Development
bun run docker:up         # Start containers
bun run docker:down       # Stop containers

# Clean rebuilds
bun run docker:rebuild    # Clean rebuild and restart
bun run docker:reset      # Nuclear option - full reset
```

### API Development

```bash
# Start API with hot reload
bun run dev

# Type checking
bun run typecheck

# Linting and formatting
bun run lint
bun run lint:fix
```

## 🗄️ Database Schema

### Current Tables

**Users** - Platform user accounts
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);
```

**Projects** - MCP service workspaces
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  github_repo TEXT,
  github_branch VARCHAR(255) DEFAULT 'main',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Planned Tables

- **MCP Services** - Host, client, and server definitions
- **Deployments** - Live service instances with metrics
- **Resource Allocation** - Usage tracking and billing

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | API server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | Required |
| `NODE_ENV` | Environment mode | `development` |

### Turborepo Tasks

All tasks are configured in `turbo.json` with proper environment variable passing:

```json
{
  "tasks": {
    "dev": { "env": ["API_PORT", "DATABASE_URL", "NODE_ENV", "REDIS_URL"] },
    "build": { "env": ["API_PORT", "DATABASE_URL", "NODE_ENV", "REDIS_URL"] },
    "db:push": { "env": ["DATABASE_URL", "NODE_ENV"] }
  }
}
```

## 🐳 Docker

### Multi-Stage Build

The API uses an optimized Dockerfile with Turborepo integration:

1. **Pruner** - Uses `turbo prune` to create minimal workspace
2. **Installer** - Installs only necessary dependencies
3. **Runner** - Production-ready container

### Development Setup

```yaml
# docker-compose.yml highlights
services:
  postgres:   # PostgreSQL 17 with health checks
  redis:      # Redis 8 for caching
  api:        # Your API with hot reload
  dbgate:     # Modern database GUI
```

## 📚 Scripts Reference

### Root Package Scripts

```bash
# Development
bun run dev              # Start all services
bun run build            # Build all packages
bun run typecheck        # Type check all packages

# Database
bun run db:push:force    # Sync schema (development)
bun run db:seed          # Add test data
bun run db:studio        # Launch Drizzle Studio

# Docker
bun run docker:rebuild   # Clean rebuild
bun run docker:reset     # Full reset

# Maintenance
bun run lint             # Check code quality
bun run changeset        # Create changeset
```

## 🎯 Roadmap

### Phase 1: Core Platform (Current)
- [x] Monorepo setup with Turborepo
- [x] Database layer with Drizzle ORM
- [x] Docker development environment
- [x] User and project management
- [ ] MCP service definitions
- [ ] Basic deployment orchestration

### Phase 2: MCP Integration
- [ ] MCP protocol implementation
- [ ] Service templates and scaffolding  
- [ ] Runtime configuration management
- [ ] Health monitoring and logging

### Phase 3: Enterprise Features
- [ ] Multi-tenant architecture
- [ ] Resource allocation and billing
- [ ] Advanced scaling and orchestration
- [ ] Monitoring and observability

### Phase 4: Platform Features
- [ ] Web dashboard and UI
- [ ] CLI tooling for developers
- [ ] Marketplace for MCP services
- [ ] Community features and sharing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork and clone the repository
2. Follow the Quick Start guide above
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and add tests
5. Run tests: `bun run test`
6. Submit a pull request

### Code Style

- **TypeScript** for all code
- **Biome** for formatting and linting
- **Conventional Commits** for commit messages
- **Changesets** for versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.ecco.dev](https://docs.ecco.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/ecco/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ecco/discussions)
- **Discord**: [Ecco Community](https://discord.gg/ecco)

## ⭐ Acknowledgments

Built with love using these amazing open-source projects:

- [Bun](https://bun.sh) - The incredibly fast JavaScript runtime
- [Turborepo](https://turbo.build) - The high-performance monorepo build system  
- [Drizzle ORM](https://orm.drizzle.team) - The TypeScript-first ORM
- [Hono](https://hono.dev) - The ultrafast web framework

---

**Made with ❤️ for the MCP community**

[⬆ Back to top](#ecco-mcp-platform)
