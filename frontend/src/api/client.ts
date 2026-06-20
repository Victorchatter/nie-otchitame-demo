import { Report, ReportCreate, Metrics } from '../types';

const API_URL = `${import.meta.env.VITE_API_URL || '/api/v1'}`;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(response.status, body || response.statusText);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => fetchJson<{ status: string }>('/health'),

  listReports: (skip = 0, limit = 100) =>
    fetchJson<Report[]>(`/reports?skip=${skip}&limit=${limit}`),

  getReport: (id: number) => fetchJson<Report>(`/reports/${id}`),

  createReport: (data: ReportCreate) =>
    fetchJson<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateReport: (id: number, data: ReportCreate) =>
    fetchJson<Report>(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReport: (id: number) =>
    fetchJson<void>(`/reports/${id}`, { method: 'DELETE' }),

  getMetrics: () => fetchJson<Metrics>('/metrics'),
};
