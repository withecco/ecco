# Turborepo + Bun Docker build following official guidelines
# https://turborepo.com/docs/guides/tools/docker

FROM oven/bun:1.2.19-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo globally
RUN bun install -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
# Prune the workspace for the api app
RUN turbo prune @ecco/api --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy pruned package.json files
COPY --from=pruner /app/out/json/ .
# Install dependencies using bun
RUN bun install --frozen-lockfile

# Copy source code of pruned subworkspace
COPY --from=pruner /app/out/full/ .

# Build the application (if we add build scripts later)
# RUN turbo run build --filter=@ecco/api

FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bun

# Copy the built application and dependencies
COPY --from=installer --chown=bun:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=bun:nodejs /app/apps/api ./apps/api
COPY --from=installer --chown=bun:nodejs /app/packages ./packages
COPY --from=installer --chown=bun:nodejs /app/package.json ./package.json

USER bun

# Expose the port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application with bun
CMD ["bun", "run", "apps/api/src/index.ts"]
