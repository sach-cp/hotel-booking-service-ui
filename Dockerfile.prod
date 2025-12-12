# Stage 1: build the Angular app
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (include dev deps for the Angular build)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy sources and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:stable-alpine

# Copy built files
COPY --from=builder /app/dist/hotel-booking-service /usr/share/nginx/html

# Use our nginx config that sets SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
