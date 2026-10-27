import { useState, useEffect, useRef } from 'react';
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

const employeeKey = (emp) => emp._id || emp.employeeId;

// Chỉ lấy các trường của form, tránh gửi _id/timestamps ngược lên API
const toForm = (data) =>
  Object.fromEntries(Object.keys(INITIAL_FORM).map((key) => [key, data[key] ?? INITIAL_FORM[key]]));

const validateForm = (form) => {
  if (!form.employeeId.trim()) return 'Mã nhân viên là bắt buộc';
  if (!form.fullName.trim()) return 'Họ tên là bắt buộc';
  if (!form.email.trim()) return 'Email là bắt buộc';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Email không hợp lệ';
  return '';
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const requestId = useRef(0);
  const alertTimer = useRef(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => setAlert(null), 4000);
  };

  const loadEmployees = async (keyword = search) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const data = await fetchEmployees(keyword);
      if (id !== requestId.current) return; // bỏ qua kết quả của request cũ
      setEmployees(data);
    } catch (err) {
      if (id === requestId.current) setAlert({ type: 'error', message: err.message });
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  // Chờ 300ms sau khi ngừng gõ mới gọi API tìm kiếm
  useEffect(() => {
    setAlert(null);
    const timer = setTimeout(() => loadEmployees(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async (e) => {
    e.preventDefault();
    const invalid = validateForm(form);
    if (invalid) {
      showAlert('error', invalid);
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        showAlert('success', 'Cập nhật nhân viên thành công');
      } else {
        await createEmployee(form);
        showAlert('success', 'Thêm nhân viên thành công');
      }
      closeModal();
      loadEmployees();
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setSaving(false);
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
    setViewMode(false);
  };

  const closeModal = () => {
    resetForm();
    setOpen(false);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (emp) => {
    setForm(toForm(emp));
    setEditingId(employeeKey(emp));
    setViewMode(false);
    setOpen(true);
  };

  const openView = async (emp) => {
    try {
      setForm(toForm(await fetchEmployee(employeeKey(emp))));
      setEditingId(employeeKey(emp));
      setViewMode(true);
      setOpen(true);
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Hệ thống Quản lý Nhân sự</h1>
        <button className="btn btn-primary" onClick={openCreate}>
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
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">
                  {search ? 'Không tìm thấy nhân viên phù hợp.' : 'Không có nhân viên nào.'}
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={employeeKey(emp)}>
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
                  <td className="actions">
                    <button className="btn btn-sm" onClick={() => openView(emp)}>Xem</button>
                    <button className="btn btn-sm" onClick={() => openEdit(emp)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(employeeKey(emp))}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-overlay" style={{ display: open ? 'flex' : 'none' }}>
        <div className="modal">
          <h3>{viewMode ? 'Thông tin nhân viên' : editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h3>
          <form onSubmit={handleSave} noValidate>
            <fieldset disabled={viewMode}>
              <div className="form-row">
                <label>Mã nhân viên (*)</label>
                <input name="employeeId" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Họ tên (*)</label>
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
                <label>Email (*)</label>
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
            </fieldset>
            <div className="form-actions">
              {viewMode ? (
                <>
                  <button type="button" className="btn" onClick={closeModal}>Đóng</button>
                  <button type="button" className="btn btn-primary" onClick={() => setViewMode(false)}>Chỉnh sửa</button>
                </>
              ) : (
                <>
                  <button type="button" className="btn" onClick={closeModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
