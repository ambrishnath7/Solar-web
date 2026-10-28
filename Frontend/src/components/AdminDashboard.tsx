import React, { useState, useEffect } from 'react';
import type { Client, Engineer, MaintenanceReport, Alert, DashboardStats } from '../types';
import { api } from '../services/api';
import {
  Lock,
  Search,
  FileText,
  Download,
  Share2,
  Edit,
  Eye,
  Plus,
  Users,
  Building,
  Bell,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Calendar,
  Send,
  Check,
  Shield,
} from 'lucide-react';
import { downloadPDF, shareViaWhatsApp } from '../utils/pdfGenerator';
import { ReportViewerModal } from './ReportViewerModal';

interface AdminDashboardProps {
  onEditReport: (report: MaintenanceReport) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onEditReport }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(localStorage.getItem('shreeabhi_admin_auth'))
  );
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'clients' | 'engineers' | 'alerts'>('reports');
  const [loading, setLoading] = useState<boolean>(false);

  // Reports view state
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [selectedReportForView, setSelectedReportForView] = useState<MaintenanceReport | null>(null);

  // Report Filters
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterEngineer, setFilterEngineer] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string>('');

  // Client Master Modal
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

  // Engineer Master Modal
  const [isEngineerModalOpen, setIsEngineerModalOpen] = useState<boolean>(false);
  const [editingEngineer, setEditingEngineer] = useState<Partial<Engineer> | null>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.adminLogin(passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        localStorage.setItem('shreeabhi_admin_auth', res.token || 'authed');
        setPasswordInput('');
      } else {
        setAuthError(res.message || 'Invalid password');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shreeabhi_admin_auth');
    setIsAuthenticated(false);
  };

  // Load Dashboard Data
  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [statsRes, reportsRes, clientsRes, engineersRes, alertsRes] = await Promise.all([
        api.getStats(),
        api.getReports({
          clientId: filterClient || undefined,
          engineerId: filterEngineer || undefined,
          status: filterStatus || undefined,
          search: searchQuery || undefined,
        }),
        api.getClients(),
        api.getEngineers(),
        api.getAlerts(),
      ]);

      setStats(statsRes);
      setReports(reportsRes);
      setClients(clientsRes);
      setEngineers(engineersRes);
      setAlerts(alertsRes);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, filterClient, filterEngineer, filterStatus, searchQuery]);

  // Client CRUD
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    try {
      if (editingClient.id) {
        await api.updateClient(editingClient.id, editingClient);
      } else {
        await api.createClient(editingClient);
      }
      setIsClientModalOpen(false);
      setEditingClient(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save client');
    }
  };

  // Engineer CRUD
  const handleSaveEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEngineer) return;

    try {
      if (editingEngineer.id) {
        await api.updateEngineer(editingEngineer.id, editingEngineer);
      } else {
        await api.createEngineer(editingEngineer);
      }
      setIsEngineerModalOpen(false);
      setEditingEngineer(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save engineer');
    }
  };

  // Alert Actions
  const handleSendAlert = async (alertId: string) => {
    try {
      const res = await api.sendAlert(alertId);
      setAlertSuccessMsg(res.message);
      setTimeout(() => setAlertSuccessMsg(''), 5000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to send alert');
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to acknowledge alert');
    }
  };

  const handleRunDailyCron = async () => {
    try {
      const res = await api.checkAndSendAlerts();
      setAlertSuccessMsg(res.message);
      setTimeout(() => setAlertSuccessMsg(''), 5000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Cron execution failed');
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl shadow-md border border-slate-200 text-center">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Admin Control Center</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Password protected access for Shree Abhi management.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Admin Password (e.g. ShreeAbhi2024)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-600 font-semibold">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition cursor-pointer shadow-sm"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-xs text-slate-500">Shree Abhi Electricals &amp; Engineering</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            PMC Operations &amp; Maintenance Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visits This Month</span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalVisitsThisMonth}</p>
            <p className="text-xs text-slate-500 mt-0.5">Submitted PMC Visits</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Defects Flagged</span>
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">{stats.defectsFoundThisMonth}</p>
            <p className="text-xs text-slate-500 mt-0.5">Need attention or parts</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Drafts</span>
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2">{stats.pendingDrafts}</p>
            <p className="text-xs text-slate-500 mt-0.5">Incomplete field reports</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AMC Contract Split</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Shield className="w-4 h-4" />
              </span>
            </div>
            <p className="text-base font-black text-slate-900 mt-2">
              <span className="text-blue-600">{stats.freeYear1ClientsCount} Free</span> /{' '}
              <span className="text-emerald-600">{stats.amcClientsCount} AMC</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Free Year 1 vs Paid AMC</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Maintenance Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'clients'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Clients Master ({clients.length})
        </button>

        <button
          onClick={() => setActiveTab('engineers')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'engineers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Engineers Master ({engineers.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'alerts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Alerts &amp; 7-Day Reminders ({alerts.filter((a) => a.status === 'pending').length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB: REPORTS LIST WITH FILTERS */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Search Ref / Client</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="PMC-2026-..., client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Filter Client</label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              >
                <option value="">All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Filter Engineer</label>
              <select
                value={filterEngineer}
                onChange={(e) => setFilterEngineer(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              >
                <option value="">All Engineers</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Report Ref</th>
                    <th className="px-4 py-3">Client &amp; Site</th>
                    <th className="px-4 py-3">Visit Date</th>
                    <th className="px-4 py-3">Engineer</th>
                    <th className="px-4 py-3">Gen (kWh)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                        No maintenance reports found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {r.reportRef}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{r.client?.clientName}</p>
                          <p className="text-slate-500 text-[11px]">{r.client?.siteName} ({r.client?.plantCapacityKw} kW)</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(r.visitDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                          {r.engineer?.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">
                          {r.genTotalThisMonth ?? '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              r.status === 'submitted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => setSelectedReportForView(r)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="View Full Report"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditReport(r)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="Edit Report"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => downloadPDF(r)}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => shareViaWhatsApp(r)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: CLIENTS MASTER MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Client Installation Directory</h2>
              <p className="text-xs text-slate-500">Manage solar sites, module wattage, inverters and AMC tracking.</p>
            </div>
            <button
              onClick={() => {
                setEditingClient({
                  clientName: '',
                  siteName: '',
                  siteAddress: '',
                  plantCapacityKw: 50,
                  modulesMake: 'Vikram Solar',
                  modulesWp: 540,
                  totalModules: 92,
                  inverterMake: 'Sungrow',
                  inverterCapacity: '50 kW',
                  totalInverters: 1,
                  contactName: '',
                  contactPhone: '',
                  contactEmail: '',
                  amcStatus: 'FREE_YEAR1',
                  isActive: true,
                });
                setIsClientModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add New Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{c.clientName}</h3>
                    <p className="text-xs text-slate-500">{c.siteName}</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      c.amcStatus === 'FREE_YEAR1' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.amcStatus === 'FREE_YEAR1' ? 'Free Year 1' : 'Active AMC'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p>
                    <span className="font-semibold text-slate-700">Capacity:</span> {c.plantCapacityKw} kW
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Modules:</span> {c.modulesMake} {c.modulesWp}Wp ({c.totalModules} Panels)
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Inverter:</span> {c.inverterMake} {c.inverterCapacity} ({c.totalInverters} Units)
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Contact:</span> {c.contactName} ({c.contactPhone})
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setEditingClient(c);
                      setIsClientModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Edit Site Specs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: ENGINEERS MASTER MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'engineers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Field Engineers Directory</h2>
              <p className="text-xs text-slate-500">Engineers appearing in the mobile PMC login selector.</p>
            </div>
            <button
              onClick={() => {
                setEditingEngineer({
                  name: '',
                  phone: '+91 ',
                  email: '',
                  isActive: true,
                });
                setIsEngineerModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Engineer
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Engineer Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {engineers.map((eng) => (
                  <tr key={eng.id}>
                    <td className="px-4 py-3 font-bold text-slate-900">{eng.name}</td>
                    <td className="px-4 py-3">{eng.phone}</td>
                    <td className="px-4 py-3">{eng.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          eng.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {eng.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingEngineer(eng);
                          setIsEngineerModalOpen(true);
                        }}
                        className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          await api.toggleEngineer(eng.id);
                          loadData();
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        {eng.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: ALERTS & 7-DAY REMINDERS */}
      {/* ========================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Automated 7-Day Maintenance Alerts</h2>
              <p className="text-xs text-slate-500">
                Fires 7 days before next visit date (calculated as visit date + 90 days - 7 days).
              </p>
            </div>
            <button
              onClick={handleRunDailyCron}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Run Daily Alert Check Now
            </button>
          </div>

          {alertSuccessMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {alertSuccessMsg}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                      No maintenance alerts scheduled.
                    </td>
                  </tr>
                ) : (
                  alerts.map((al) => (
                    <tr key={al.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{al.client?.clientName}</p>
                        <p className="text-slate-500 text-[11px]">{al.client?.siteName}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {new Date(al.dueDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 uppercase font-mono text-[11px]">
                        {al.alertType}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            al.status === 'sent'
                              ? 'bg-blue-100 text-blue-800'
                              : al.status === 'acknowledged'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {al.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {al.status === 'pending' && (
                          <button
                            onClick={() => handleSendAlert(al.id)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Send Alert Email
                          </button>
                        )}
                        {al.status === 'sent' && (
                          <button
                            onClick={() => handleAcknowledgeAlert(al.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                          >
                            Mark Acknowledged
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Full Report Details Modal */}
      {/* ========================================================= */}
      <ReportViewerModal
        report={selectedReportForView}
        onClose={() => setSelectedReportForView(null)}
        onEdit={(r) => {
          setSelectedReportForView(null);
          onEditReport(r);
        }}
      />

      {/* ========================================================= */}
      {/* Client Edit/Add Modal */}
      {/* ========================================================= */}
      {isClientModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              {editingClient.id ? 'Edit Client Site Specs' : 'Add New Client'}
            </h3>

            <form onSubmit={handleSaveClient} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Client / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingClient.clientName || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, clientName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Site Name *</label>
                  <input
                    type="text"
                    required
                    value={editingClient.siteName || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, siteName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600">Site Address</label>
                <textarea
                  rows={2}
                  value={editingClient.siteAddress || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, siteAddress: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Capacity (kW) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingClient.plantCapacityKw || 0}
                    onChange={(e) => setEditingClient({ ...editingClient, plantCapacityKw: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Panel Wattage (Wp)</label>
                  <input
                    type="number"
                    value={editingClient.modulesWp || 540}
                    onChange={(e) => setEditingClient({ ...editingClient, modulesWp: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Total Panels</label>
                  <input
                    type="number"
                    value={editingClient.totalModules || 0}
                    onChange={(e) => setEditingClient({ ...editingClient, totalModules: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Modules Brand/Make</label>
                  <input
                    type="text"
                    value={editingClient.modulesMake || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, modulesMake: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Inverter Make &amp; Rating</label>
                  <input
                    type="text"
                    value={editingClient.inverterMake || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, inverterMake: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Contact Person</label>
                  <input
                    type="text"
                    value={editingClient.contactName || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, contactName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Contact Phone</label>
                  <input
                    type="text"
                    value={editingClient.contactPhone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, contactPhone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">AMC Status</label>
                  <select
                    value={editingClient.amcStatus || 'FREE_YEAR1'}
                    onChange={(e) => setEditingClient({ ...editingClient, amcStatus: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    <option value="FREE_YEAR1">Free Year 1</option>
                    <option value="AMC">Paid AMC</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold cursor-pointer"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Engineer Edit/Add Modal */}
      {/* ========================================================= */}
      {isEngineerModalOpen && editingEngineer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingEngineer.id ? 'Edit Engineer' : 'Add New Engineer'}
            </h3>

            <form onSubmit={handleSaveEngineer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingEngineer.name || ''}
                  onChange={(e) => setEditingEngineer({ ...editingEngineer, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Mobile Phone</label>
                <input
                  type="text"
                  value={editingEngineer.phone || ''}
                  onChange={(e) => setEditingEngineer({ ...editingEngineer, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  value={editingEngineer.email || ''}
                  onChange={(e) => setEditingEngineer({ ...editingEngineer, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEngineerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold cursor-pointer"
                >
                  Save Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
