# Stage 1: Build React/Vite application
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Stage 2: Serve production build with Nginx
FROM nginx:alpine

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache 'libuuid>=2.42.3-r0'

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
