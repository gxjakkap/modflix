FROM oven/bun:latest AS pruner
WORKDIR /app

COPY . .

# Run turbo prune to extract the api workspace
RUN bunx turbo prune elysia --docker

FROM oven/bun:latest AS builder
WORKDIR /app

# Copy the pruned lockfile and package.json's to install dependencies
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock

RUN bun install

# Copy the actual source files
COPY --from=pruner /app/out/full/ .

# Build the API
RUN bun build --minify-whitespace --minify-syntax --target bun --outfile server.js apps/api/src/index.ts

FROM oven/bun:latest AS rbase
WORKDIR /app
COPY --from=builder /app/server.js /app/server.js

FROM rbase AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 app

USER app

EXPOSE 3000
ENV PORT=3000
CMD ["bun", "/app/server.js"]