# Stage 1: Build production React application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application sources
COPY . .

# Build production distribution
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose Cloud Run default port
EXPOSE 8080

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
