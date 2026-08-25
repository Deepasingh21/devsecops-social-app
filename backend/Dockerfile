FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY server.js ./

RUN mkdir -p uploads && chown -R node:node /app

EXPOSE 5000

USER node

CMD ["node", "server.js"]
