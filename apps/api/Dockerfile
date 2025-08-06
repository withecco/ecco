# Use Bun's official image
FROM oven/bun:1.2.19-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace configuration
COPY package.json bun.lockb* ./
COPY turbo.json ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/postgres/package.json ./packages/postgres/

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json

# Copy source code
COPY apps/api ./apps/api
COPY packages/core ./packages/core
COPY packages/postgres ./packages/postgres

# Copy TypeScript configs
COPY apps/api/tsconfig.json ./apps/api/
COPY packages/core/tsconfig.json ./packages/core/
COPY packages/postgres/tsconfig.json ./packages/postgres/

# Build the application (if you add build scripts later)
# RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bun

# Copy built application
COPY --from=builder --chown=bun:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=bun:nodejs /app/apps/api ./apps/api
COPY --from=builder --chown=bun:nodejs /app/packages ./packages
COPY --from=builder --chown=bun:nodejs /app/package.json ./package.json

USER bun

# Expose the port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "apps/api/src/index.ts"]
