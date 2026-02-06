# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema first (untuk generate)
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Generate Prisma Client (PENTING: sebelum copy source)
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY nest-cli.json ./
COPY tsconfig.build.json ./

# Build the NestJS application
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist/src && ls -la /app/dist/src/main.js

# ==========================================
# Stage 2: Production
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies (npm v7+ syntax)
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma schema (diperlukan untuk runtime)
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma Client dari builder
COPY --from=builder /app/generated ./generated

# Copy built application dari builder
COPY --from=builder /app/dist ./dist

# Verify dist exists
RUN ls -la /app/dist/src

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/src/main.js"]
