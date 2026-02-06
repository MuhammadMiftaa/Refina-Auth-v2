# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (PENTING: sebelum build)
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# ==========================================
# Stage 2: Production
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema (diperlukan untuk runtime)
COPY prisma ./prisma

# Copy generated Prisma Client dari builder
COPY --from=builder /app/generated ./generated

# Copy built application dari builder
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/main"]
