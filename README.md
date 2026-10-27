# Hệ thống Quản lý Nhân sự (HR Management System)

## Thông tin sinh viên
- Họ tên: Trần Đình Bảo Long
- MSSV: 239679
- Lớp: DH23TIN10

## Mô tả
Hệ thống quản lý nhân sự cho phép xem danh sách, thêm, tìm kiếm, cập nhật
và xóa hồ sơ nhân viên. Dữ liệu lưu trên MongoDB Atlas, backend và
frontend triển khai trên Render.

## Công nghệ sử dụng
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Container: Docker, Docker Hub
- Deploy: Render

## Hướng dẫn chạy môi trường phát triển
### Backend
```bash
cd backend
cp .env.example .env
# Chỉnh MONGODB_URI và PORT trong .env
npm install
npm start
```
Backend chạy tại `http://localhost:5000`, endpoint kiểm tra: `GET /health`.

### Frontend
```bash
cd frontend
cp .env.example .env
# Chỉnh VITE_API_URL trỏ đến backend
npm install
npm run dev
```

### Backend bằng Docker
```bash
cd backend
docker build -t longtran2111/backend:latest .
docker run -d --name backend -p 5000:5000 \
  -e PORT=5000 \
  -e MONGODB_URI="<chuỗi kết nối MongoDB Atlas>" \
  longtran2111/backend:latest
```
Hoặc dùng image có sẵn trên Docker Hub:
```bash
docker pull longtran2111/backend:latest
docker run -d --name backend -p 5000:5000 \
  -e PORT=5000 \
  -e MONGODB_URI="<chuỗi kết nối MongoDB Atlas>" \
  longtran2111/backend:latest
```
Kiểm tra: `curl http://localhost:5000/health`.

### Frontend bằng Docker
```bash
cd frontend
docker build -t longtran2111/frontend:latest .
docker run -d --name frontend -p 8080:80 \
  -e BACKEND_URL="https://<backend-api>" \
  longtran2111/frontend:latest
```
Hoặc dùng image có sẵn trên Docker Hub:
```bash
docker pull longtran2111/frontend:latest
docker run -d --name frontend -p 8080:80 \
  -e BACKEND_URL="https://<backend-api>" \
  longtran2111/frontend:latest
```
Frontend chạy tại `http://localhost:8080`. Ứng dụng gọi API qua đường dẫn `/api`,
nginx trong container chuyển tiếp sang `BACKEND_URL` (truyền lúc chạy, không nhúng
địa chỉ localhost vào image). Nếu muốn nhúng thẳng địa chỉ API vào bundle thì build với
`--build-arg VITE_API_URL=https://<backend-api>/api`.

## Triển khai trên Render
- Backend: Web Service chạy Docker image `longtran2111/backend:latest`, biến môi trường
  `MONGODB_URI` (chuỗi kết nối Atlas), health check `/health`.
  API: https://two39679-trandinhbaolong-backend.onrender.com/api/employees
- Frontend: Static Site dựng từ GitHub (`npm ci && npm run build`, publish `frontend/build`).
  Địa chỉ API production đặt trong `frontend/.env.production`
  (`VITE_API_URL=https://two39679-trandinhbaolong-backend.onrender.com/api`).
  Ứng dụng: https://two39679-trandinhbaolong.onrender.com

## Link tài nguyên
- Link GitHub repository: https://github.com/Avann21/239679_TranDinhBaoLong.git
- Link Docker Hub Backend: https://hub.docker.com/r/longtran2111/backend
- Link Docker Hub Frontend: https://hub.docker.com/r/longtran2111/frontend
- Link Render App (Frontend): https://two39679-trandinhbaolong.onrender.com
- Link Render API (Backend): https://two39679-trandinhbaolong-backend.onrender.com
- Link MongoDB Atlas: mongodb+srv://239679-TranDinhBaoLong:Long123456@cluster0.z1v98m5.mongodb.net/
