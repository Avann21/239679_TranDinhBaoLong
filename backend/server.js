require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS — cho phép tất cả (đơn giản cho bài thi)
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Routes
app.use('/api/employees', require('./routes/employees'));

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