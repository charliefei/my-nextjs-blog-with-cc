# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (for layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the static export (user site mode — no basePath, ideal for Docker)
RUN npm run build

# Stage 2: Runtime (nginx)
FROM nginx:alpine

# Copy static files from build stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
