# syntax = docker/dockerfile:1

# ===========================
# Stage 1: Base Image
# ===========================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies required for building native modules and Prisma compatibility
RUN apk add --no-cache \
    build-base \
    python3 \
    openssl \
    libc6-compat

# ===========================
# Stage 2: Dependencies
# ===========================
FROM base AS dependencies

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# ===========================
# Stage 3: Build
# ===========================
FROM dependencies AS build

# Set working directory
WORKDIR /app

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy the rest of the application code
COPY . .

# Build the application (assuming a build script is defined in package.json)
RUN npm run build

# ===========================
# Stage 4: Production
# ===========================
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install runtime dependencies for Prisma
RUN apk add --no-cache \
    openssl \
    libc6-compat

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Install only production dependencies
RUN npm ci --only=production

# Command to run the application
CMD ["npm", "run", "start"]