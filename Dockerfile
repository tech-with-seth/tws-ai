# syntax = docker/dockerfile:1

# ===========================
# Stage 1: Base Image
# ===========================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies required for building native modules
RUN apk add --no-cache build-base python3

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

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# ===========================
# Stage 4: Production Dependencies
# ===========================
FROM base AS production-dependencies

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# ===========================
# Stage 5: Final Production Image
# ===========================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies (if any)
RUN apk add --no-cache openssl

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production dependencies
COPY --from=production-dependencies /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma

# Change ownership to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the necessary port
EXPOSE 3000

# Define the startup command
CMD ["npm", "run", "start"]