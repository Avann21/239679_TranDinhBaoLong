# ============================================
# Frontend - React (Vite) + Nginx
# MSSV: 239679 - Trần Đình Bảo Long
# ============================================

# ---------- Giai đoạn build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy manifest trước để tận dụng cache layer
COPY package*.json ./
RUN npm ci

COPY . .

# Địa chỉ Backend API được nhúng vào bundle lúc build.
# Mặc định "/api" (cùng origin) và nginx sẽ chuyển tiếp sang BACKEND_URL khi chạy container.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Giai đoạn chạy ----------
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Địa chỉ Backend API, truyền vào khi chạy container:
#   docker run -e BACKEND_URL=https://<backend-api> ...
ENV BACKEND_URL=http://backend:5000

EXPOSE 80
