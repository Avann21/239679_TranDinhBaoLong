const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const request = async (path, options) => {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Không kết nối được tới máy chủ. Vui lòng kiểm tra Backend API.');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Yêu cầu thất bại, vui lòng thử lại');
  return data;
};

const jsonOptions = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const fetchEmployees = (search = '') =>
  request(`/employees${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const fetchEmployee = (id) => request(`/employees/${id}`);

export const createEmployee = (data) => request('/employees', jsonOptions('POST', data));

export const updateEmployee = (id, data) => request(`/employees/${id}`, jsonOptions('PUT', data));

export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });
