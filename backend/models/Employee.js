const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    fullName:   { type: String, required: true, trim: true },
    gender:     { type: String, default: '' },
    dateOfBirth:{ type: String, default: '' },
    department: { type: String, default: '' },
    position:   { type: String, default: '' },
    email:      { type: String, required: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'] },
    phone:      { type: String, default: '' },
    hireDate:   { type: String, default: '' },
    status:     { type: String, default: 'Đang làm việc' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);