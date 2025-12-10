# Stage 1: Install dependencies
FROM node:18-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development runtime
FROM node:18-slim
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy Angular source
COPY . .

# Angular dev server must listen on 0.0.0.0 for Render
ENV HOST=0.0.0.0
ENV PORT=10000

EXPOSE 10000

# Start Angular dev mode
CMD ["npm", "run", "start:dev"]
