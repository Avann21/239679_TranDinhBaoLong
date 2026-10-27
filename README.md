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

## Link tài nguyên
- Link GitHub repository: https://github.com/Avann21/239679_TranDinhBaoLong.git
- Link Docker Hub Backend: https://hub.docker.com/r/longtran2111/backend
- Link Docker Hub Frontend: (chưa có)
- Link Render App: (chưa có)
- Link Render API: (chưa có)
- Link MongoDB Atlas: (MongoDB Atlas, không công khai chuỗi kết nối)
