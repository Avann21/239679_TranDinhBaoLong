const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Employee = require('../models/Employee');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Người dùng gõ "An" thì tìm bình thường, nhưng ký tự regex như "(" không làm sập API
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// :id có thể là _id của MongoDB hoặc mã nhân viên
const toIdQuery = (id) =>
  mongoose.isValidObjectId(id) ? { _id: id } : { employeeId: id };

const isDuplicateError = (err) => err && (err.code === 11000 || err.code === 11001);

// Bỏ các trường hệ thống để client không sửa được _id/timestamps
const pickFields = (body = {}) => {
  const { _id, __v, createdAt, updatedAt, ...data } = body;
  return data;
};

// partial: chỉ kiểm tra các trường có trong body (dùng cho PUT)
const validateInput = (body, { partial = false } = {}) => {
  const data = pickFields(body);
  for (const field of ['employeeId', 'fullName', 'email']) {
    if (partial && data[field] === undefined) continue;
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      return { error: `${field} là bắt buộc và không được để trống` };
    }
    data[field] = data[field].trim();
  }
  if (data.email !== undefined && !EMAIL_REGEX.test(data.email)) {
    return { error: 'Email không hợp lệ' };
  }
  return { data };
};

// GET /api/employees?search=...
router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().slice(0, 100);
    const filter = search
      ? {
          $or: [
            { employeeId: new RegExp(escapeRegex(search), 'i') },
            { fullName: new RegExp(escapeRegex(search), 'i') },
          ],
        }
      : {};
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/employees/:id  (id có thể là _id hoặc employeeId)
router.get('/:id', async (req, res) => {
  try {
    const emp = await Employee.findOne(toIdQuery(req.params.id));
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  const { error, data } = validateInput(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const existed = await Employee.findOne({ employeeId: data.employeeId });
    if (existed) return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
    const emp = await Employee.create(data);
    res.status(201).json(emp);
  } catch (err) {
    if (isDuplicateError(err)) return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  const { error, data } = validateInput(req.body, { partial: true });
  if (error) return res.status(400).json({ message: error });
  try {
    const emp = await Employee.findOneAndUpdate(toIdQuery(req.params.id), data, {
      new: true,
      runValidators: true,
    });
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (err) {
    if (isDuplicateError(err)) return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const emp = await Employee.findOneAndDelete(toIdQuery(req.params.id));
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Đã xóa nhân viên', employee: emp });
  } catch (err) {
    res.status(500).json({ message: 'Xóa thất bại', error: err.message });
  }
});

module.exports = router;
