require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS — cho phép tất cả (đơn giản cho bài thi)
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) =>
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date(),
  }),
);

// Routes
app.use('/api/employees', require('./routes/employees'));

// Endpoint không tồn tại
app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy endpoint' }));

// Luôn trả lỗi dạng JSON, kể cả khi body JSON sai định dạng
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: status === 400 ? 'Dữ liệu JSON không hợp lệ' : 'Lỗi server',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Thiếu MONGODB_URI trong biến môi trường');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });