import { useState, useEffect } from 'react';
import './App.css';
import {
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './api';

const INITIAL_FORM = {
  employeeId: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Đang làm việc',
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, [search]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees(search);
      setEmployees(data);
      setAlert(null);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        showAlert('success', 'Cập nhật nhân viên thành công');
      } else {
        await createEmployee(form);
        showAlert('success', 'Thêm nhân viên thành công');
      }
      resetForm();
      setOpen(false);
      loadEmployees();
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
    try {
      await deleteEmployee(id);
      showAlert('success', 'Xóa nhân viên thành công');
      loadEmployees();
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const resetForm = () => {
    setForm({ ...INITIAL_FORM });
    setEditingId(null);
  };

  const openEdit = (emp) => {
    setForm({ ...emp });
    setEditingId(emp._id || emp.employeeId);
    setOpen(true);
  };

  const filtered = employees.filter(
    (e) =>
      !search ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <header>
        <h1>Hệ thống Quản lý Nhân sự</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setOpen(true); }}>
          Thêm nhân viên
        </button>
      </header>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <div className="card">
        <input
          className="input"
          placeholder="Tìm theo mã nhân viên hoặc họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="empty">Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="8" className="empty">Không có nhân viên nào.</td></tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp._id || emp.employeeId}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <span className={`badge ${emp.status === 'Đang làm việc' ? 'badge-active' : 'badge-inactive'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => openEdit(emp)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id || emp.employeeId)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-overlay" style={{ display: open ? 'flex' : 'none' }}>
        <div className="modal">
          <h3>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-row">
              <label>Mã nhân viên</label>
              <input name="employeeId" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Họ tên</label>
              <input name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Giới tính</label>
              <select name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} >
                <option value="">--</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-row">
              <label>Ngày sinh</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Phòng ban</label>
              <input name="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Chức vụ</label>
              <input name="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Ngày vào làm</label>
              <input type="date" name="hireDate" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Trạng thái</label>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => { resetForm(); setOpen(false); }}>Hủy</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
