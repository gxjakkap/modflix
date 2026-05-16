FROM oven/bun:latest AS pruner
WORKDIR /app

COPY . .

# Run turbo prune to extract the api workspace
RUN bunx turbo prune @modflix/api --docker

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
RUN bun build --compile ./packages/db/scripts/migrate.ts --outfile ./migrate --minify

FROM oven/bun:latest AS rbase
WORKDIR /app
COPY --from=builder /app/server.js /app/server.js

FROM rbase AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 bunuser \
  && useradd --system --uid 1001 --gid bunuser --create-home bunuser \
  && mkdir -p /home/bunuser \
  && chown bunuser:bunuser /home/bunuser

COPY --from=builder --chown=bunuser:bunuser /app/packages/db/drizzle ./drizzle
COPY --from=builder --chown=bunuser:bunuser /app/migrate ./migrate

USER bunuser

EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "./migrate && bun /app/server.js"]
