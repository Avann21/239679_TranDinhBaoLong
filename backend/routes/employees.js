const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees?search=...
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = { $or: [{ employeeId: regex }, { fullName: regex }] };
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/employees/:id  (id có thể là _id hoặc employeeId)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let emp = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      emp = await Employee.findById(id);
    }
    if (!emp) emp = await Employee.findOne({ employeeId: id });
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'employeeId, fullName, email là bắt buộc' });
    }
    const existed = await Employee.findOne({ employeeId });
    if (existed) {
      return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
    }
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { employeeId: id };
    const emp = await Employee.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { employeeId: id };
    const emp = await Employee.findOneAndDelete(query);
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Đã xóa nhân viên', employee: emp });
  } catch (err) {
    res.status(500).json({ message: 'Xóa thất bại', error: err.message });
  }
});

module.exports = router;