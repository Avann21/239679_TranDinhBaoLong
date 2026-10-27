# ============================================
# Backend API - Node.js + Express
# MSSV: 239679 - Trần Đình Bảo Long
# ============================================

FROM node:20-alpine

WORKDIR /app

# Copy manifest trước để tận dụng cache layer khi chỉ source thay đổi
COPY package*.json ./

# Chỉ cài dependencies production (bỏ nodemon và devDependencies)
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

# PORT và MONGODB_URI được truyền vào khi chạy container (docker run -e ...)
EXPOSE 5000

# Chạy bằng user node (không dùng root)
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- "http://127.0.0.1:${PORT:-5000}/health" || exit 1

CMD ["node", "server.js"]
