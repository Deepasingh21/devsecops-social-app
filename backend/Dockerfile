# Stage 1: Build production dependencies
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src
COPY server.js ./


# Stage 2: Production runtime
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Update Debian packages to the latest security fixes
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    # Remove npm and bundled package managers from production image
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack \
              /opt/yarn-v1.22.22

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./

EXPOSE 5000

USER node

CMD ["server.js"]
