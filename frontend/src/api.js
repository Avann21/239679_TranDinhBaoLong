const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchEmployees = async (search = '') => {
  const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không tải được danh sách nhân viên');
  return res.json();
};

export const fetchEmployee = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Không tải được thông tin nhân viên');
  return res.json();
};

export const createEmployee = async (data) => {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Thêm nhân viên thất bại');
  }
  return res.json();
};

export const updateEmployee = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Cập nhật thất bại');
  }
  return res.json();
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Xóa thất bại');
  }
  return res.json();
};
