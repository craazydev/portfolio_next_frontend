const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Generic fetch wrapper ─────────────────────────────────────────────────
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Public API ──────────────────────────────────────────────────────────────
export async function getProfile() {
  const data = await request<{ data: unknown }>('/profile');
  return data.data;
}

export async function getProjects(params?: { category?: string; featured?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.featured !== undefined) qs.set('featured', String(params.featured));
  const query = qs.toString() ? `?${qs}` : '';
  const data  = await request<{ data: unknown[] }>(`/projects${query}`);
  return data.data as never[];
}

export async function getProject(slug: string) {
  const data = await request<{ data: unknown }>(`/projects/${slug}`);
  return data.data;
}

export async function getBlogs(params?: { tag?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.tag)    qs.set('tag',   params.tag);
  if (params?.page)   qs.set('page',  String(params.page));
  if (params?.limit)  qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs}` : '';
  return request<{ data: unknown[]; total: number; page: number }>(`/blog${query}`);
}

export async function getBlog(slug: string) {
  const data = await request<{ data: unknown }>(`/blog/${slug}`);
  return data.data;
}

export async function sendContact(body: {
  name: string; email: string; subject?: string; message: string;
}) {
  return request('/contact', {
    method: 'POST',
    body:   JSON.stringify(body),
  });
}

// ─── Admin API (requires token) ───────────────────────────────────────────────
function adminHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { Authorization: `Bearer ${token}` };
}

export async function adminCreateProject(data: unknown) {
  return request('/projects', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
}

export async function adminUpdateProject(id: string, data: unknown) {
  return request(`/projects/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
}

export async function adminDeleteProject(id: string) {
  return request(`/projects/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminCreatePost(data: unknown) {
  return request('/blog', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
}

export async function adminUpdatePost(id: string, data: unknown) {
  return request(`/blog/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
}

export async function adminDeletePost(id: string) {
  return request(`/blog/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminUpdateProfile(data: unknown) {
  return request('/profile', { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
}
