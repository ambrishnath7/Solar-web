import type { Client, Engineer, MaintenanceReport, Alert, DashboardStats } from '../types';

const API_BASE = '/api';

export const api = {
  // Engineers
  async getEngineers(activeOnly = false): Promise<Engineer[]> {
    const res = await fetch(`${API_BASE}/engineers?activeOnly=${activeOnly}`);
    if (!res.ok) throw new Error('Failed to fetch engineers');
    return res.json();
  },

  async createEngineer(data: Partial<Engineer>): Promise<Engineer> {
    const res = await fetch(`${API_BASE}/engineers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create engineer');
    return res.json();
  },

  async updateEngineer(id: string, data: Partial<Engineer>): Promise<Engineer> {
    const res = await fetch(`${API_BASE}/engineers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update engineer');
    return res.json();
  },

  async toggleEngineer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/engineers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to toggle engineer active state');
  },

  // Clients
  async getClients(activeOnly = false, search = ''): Promise<Client[]> {
    const params = new URLSearchParams();
    if (activeOnly) params.append('activeOnly', 'true');
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/clients?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async getClient(id: string): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/${id}`);
    if (!res.ok) throw new Error('Failed to fetch client details');
    return res.json();
  },

  async createClient(data: Partial<Client>): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update client');
    return res.json();
  },

  async toggleClient(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to toggle client active state');
  },

  // Reports
  async getReports(filters?: {
    clientId?: string;
    engineerId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<MaintenanceReport[]> {
    const params = new URLSearchParams();
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.engineerId) params.append('engineerId', filters.engineerId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async getReport(id: string): Promise<MaintenanceReport> {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  async getLatestClientReport(clientId: string): Promise<{ prevVisitDate: string | null; reportRef: string | null }> {
    const res = await fetch(`${API_BASE}/reports/client/${clientId}/latest`);
    if (!res.ok) throw new Error('Failed to fetch client latest report');
    return res.json();
  },

  async saveDraft(data: Partial<MaintenanceReport>): Promise<MaintenanceReport> {
    const res = await fetch(`${API_BASE}/reports/save-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save draft');
    return res.json();
  },

  async submitFinal(data: Partial<MaintenanceReport>): Promise<MaintenanceReport> {
    const res = await fetch(`${API_BASE}/reports/submit-final`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit final report');
    }
    return res.json();
  },

  async updateReport(id: string, data: Partial<MaintenanceReport>): Promise<MaintenanceReport> {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/reports/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Alerts
  async getAlerts(status?: string): Promise<Alert[]> {
    const url = status ? `${API_BASE}/alerts?status=${status}` : `${API_BASE}/alerts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async sendAlert(id: string): Promise<{ message: string; emailSubject: string; emailBody: string }> {
    const res = await fetch(`${API_BASE}/alerts/${id}/send`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to send alert');
    return res.json();
  },

  async acknowledgeAlert(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
  },

  async checkAndSendAlerts(): Promise<{ processedCount: number; sentCount: number; message: string }> {
    const res = await fetch(`${API_BASE}/alerts/check-and-send`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to check and send daily alerts');
    return res.json();
  },

  // Auth
  async adminLogin(password: string): Promise<{ success: boolean; token?: string; message: string }> {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      return { success: false, message: 'Invalid admin password' };
    }
    return res.json();
  },
};
