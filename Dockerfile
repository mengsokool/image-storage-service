# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# ติดตั้ง pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# คัดลอกไฟล์ package.json และ pnpm-lock.yaml (ถ้ามี)
COPY package.json pnpm-lock.yaml* ./

# ติดตั้ง dependencies
RUN pnpm install --frozen-lockfile

# คัดลอก source code
COPY . .

# Build โปรเจค
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# ติดตั้ง pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# คัดลอกไฟล์ package.json และ pnpm-lock.yaml (ถ้ามี)
COPY package.json pnpm-lock.yaml* ./

# ติดตั้งเฉพาะ production dependencies
RUN pnpm install --prod --frozen-lockfile

# คัดลอกไฟล์ที่ build แล้วจาก builder stage
COPY --from=builder /app/dist ./dist

# สร้างโฟลเดอร์ uploads
RUN mkdir uploads

# ตั้งค่า environment variables
ENV NODE_ENV=production
ENV PORT=5100

# Expose port
EXPOSE 5100

# รันแอปพลิเคชัน
CMD ["node", "dist/index.js"] 