'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import BucolishLogo from '@/components/brand/BucolishLogo';
import {
  Users,
  ShieldAlert,
  Flame,
  Heart,
  MessageSquare,
  ShieldCheck,
  Ban,
  Trash2,
  CheckCircle2,
  Search,
  RefreshCw,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  UserX,
  Building,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
  KeyRound,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function AdminConsolePage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminIdentifier, setAdminIdentifier] = useState('admin@bucolish.com');
  const [adminPassword, setAdminPassword] = useState('Bucolish@Admin2026');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalSwipes: 0,
    totalMatches: 0,
    totalMessages: 0,
    verifiedUsers: 0,
    pendingReports: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'USERS' | 'REPORTS'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [actionSuccess, setActionSuccess] = useState('');

  // Check if current user is already an admin
  const checkCurrentAdminSession = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user && (data.user.role === 'ADMIN' || data.user.email === 'admin@bucolish.com')) {
          setIsAdminLoggedIn(true);
          fetchAdminData();
          return;
        }
      }
    } catch {}
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/v1/auth/password-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: adminIdentifier.trim().toLowerCase(),
          password: adminPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setIsAdminLoggedIn(true);
        fetchAdminData();
      } else {
        setLoginError(data.error || 'Invalid Admin Credentials');
      }
    } catch {
      setLoginError('Connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/v1/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || {});
      }

      // 2. Fetch Users
      const usersRes = await fetch('/api/v1/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // 3. Fetch Reports
      const reportsRes = await fetch('/api/v1/admin/reports');
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentAdminSession();
  }, []);

  const handleUserAction = async (userId: string, action: string, value?: any) => {
    if (action === 'DELETE' && !confirm('Are you sure you want to permanently delete this user from the database?')) {
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          status: action === 'BAN' ? 'BANNED' : action === 'RESTRICT' ? 'RESTRICTED' : action === 'ACTIVATE' ? 'USER' : undefined,
          kycStatus: action === 'KYC' ? value : undefined,
        }),
      });

      if (res.ok) {
        setActionSuccess(`Action '${action}' executed successfully on user.`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Admin action error:', err);
    }
  };

  const handleReportAction = async (reportId: string, action: 'RESOLVE' | 'DISMISS') => {
    try {
      const res = await fetch('/api/v1/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: action === 'RESOLVE' ? 'RESOLVED' : 'DISMISSED' }),
      });
      if (res.ok) {
        setActionSuccess(`Report marked as ${action === 'RESOLVE' ? 'Resolved' : 'Dismissed'}`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Report moderation error:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery) ||
      u.sector?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterRole === 'ALL' ||
      (filterRole === 'BANNED' && u.role === 'BANNED') ||
      (filterRole === 'VERIFIED' && u.kycStatus === 'VERIFIED');
    return matchesSearch && matchesFilter;
  });

  // ADMIN LOGIN GATE SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center py-12 px-4 selection:bg-purple-600 selection:text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col items-center text-center">
            <BucolishLogo size="md" showTagline={false} />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/80 border border-purple-800 text-purple-300 rounded-full text-xs font-black mt-3">
              <Shield size={12} />
              <span>Founder & Backend Control</span>
            </div>
            <h1 className="text-xl font-black text-white mt-3">
              Admin Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Enter official Bucolish founder credentials to unlock live database moderation and KPI analytics.
            </p>
          </div>

          {/* Credentials Info Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
              Official Master Admin Credentials:
            </div>
            <div>
              Email / ID: <span className="text-purple-400 font-mono font-bold">admin@bucolish.com</span>
            </div>
            <div>
              Password: <span className="text-purple-400 font-mono font-bold">Bucolish@Admin2026</span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs font-bold text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email / ID
              </label>
              <input
                type="text"
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full btn-primary !py-3 !rounded-xl text-xs font-black justify-center shadow-lg"
            >
              {loginLoading ? 'Authenticating...' : 'Unlock Founder Portal'}
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN FOUNDER CONSOLE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={{ name: 'Founder Admin', role: 'ADMIN' }}
        onOpenAuth={() => {}}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Bucolish Founder & Backend Control Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-950 text-purple-300 border border-purple-800">
                LIVE DB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Real-time user monitoring, database records, Gurugram sector analytics, and trust moderation.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* METRICS KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Registered', value: stats.totalUsers || users.length, icon: Users, color: 'text-purple-400' },
            { label: 'Total LinkUps', value: stats.totalSwipes || 0, icon: Flame, color: 'text-indigo-400' },
            { label: 'MatchBox Formations', value: stats.totalMatches || 0, icon: Heart, color: 'text-pink-400' },
            { label: 'Messages Sent', value: stats.totalMessages || 0, icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Verified Residents', value: stats.verifiedUsers || 0, icon: ShieldCheck, color: 'text-emerald-400' },
            { label: 'Pending Reports', value: reports.length, icon: ShieldAlert, color: 'text-amber-400' },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <Icon size={16} className={kpi.color} />
                </div>
                <div className="text-2xl font-black text-white">
                  {kpi.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* TAB CONTROLS */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-md">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'USERS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            User Database ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'REPORTS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety Reports ({reports.length})
          </button>
        </div>

        {/* TAB 1: USERS DIRECTORY & CONTROL */}
        {activeTab === 'USERS' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, sector..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Residents</option>
                  <option value="VERIFIED">Verified Only</option>
                  <option value="BANNED">Banned Users</option>
                </select>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Resident</th>
                    <th className="p-3.5">Phone / Email</th>
                    <th className="p-3.5">Sector & Budget</th>
                    <th className="p-3.5">KYC Status</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Owner Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-bold">
                        No user registrations found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isBanned = u.role === 'BANNED';
                      const isRestricted = u.role === 'RESTRICTED';

                      return (
                        <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-extrabold text-white text-sm">
                                {u.name || 'Unnamed'}, {u.age || '—'}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {u.occupation || 'Resident'} {u.company ? `@ ${u.company}` : ''}
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 font-semibold text-slate-200">
                            <div>{u.phone}</div>
                            {u.email && <div className="text-[10px] text-purple-400">{u.email}</div>}
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-purple-300">{u.sector || 'Gurugram'}</div>
                            <div className="text-[10px] text-slate-400">{u.budget || '—'}</div>
                          </td>

                          <td className="p-3.5">
                            {u.kycStatus === 'VERIFIED' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 w-fit">
                                <Check size={11} /> Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                                Unverified
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            {isBanned ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800">
                                BANNED
                              </span>
                            ) : isRestricted ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-800">
                                RESTRICTED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/60 text-emerald-400">
                                ACTIVE
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle KYC */}
                              {u.kycStatus !== 'VERIFIED' ? (
                                <button
                                  onClick={() => handleUserAction(u.id, 'KYC', 'VERIFIED')}
                                  className="p-1.5 bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 rounded-lg text-[10px] font-bold border border-slate-700"
                                  title="Approve KYC Verification"
                                >
                                  <Check size={13} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(u.id, 'KYC', 'UNVERIFIED')}
                                  className="p-1.5 bg-slate-800 hover:bg-amber-900/60 text-amber-400 rounded-lg text-[10px] font-bold border border-slate-700"
                                  title="Revoke KYC"
                                >
                                  Revoke
                                </button>
                              )}

                              {/* Ban / Unban */}
                              {isBanned ? (
                                <button
                                  onClick={() => handleUserAction(u.id, 'ACTIVATE')}
                                  className="px-2 py-1 bg-slate-800 hover:bg-emerald-900/80 text-emerald-300 rounded-lg text-[10px] font-bold border border-slate-700"
                                >
                                  Unban
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(u.id, 'BAN')}
                                  className="p-1.5 bg-slate-800 hover:bg-rose-900/80 text-rose-400 rounded-lg text-[10px] font-bold border border-slate-700"
                                  title="Ban Resident"
                                >
                                  <Ban size={13} />
                                </button>
                              )}

                              {/* Restrict */}
                              {!isRestricted && !isBanned && (
                                <button
                                  onClick={() => handleUserAction(u.id, 'RESTRICT')}
                                  className="p-1.5 bg-slate-800 hover:bg-amber-900/80 text-amber-400 rounded-lg text-[10px] font-bold border border-slate-700"
                                  title="Restrict Discovery"
                                >
                                  <Lock size={13} />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleUserAction(u.id, 'DELETE')}
                                className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg text-[10px] font-bold border border-slate-700"
                                title="Delete permanently"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY REPORTS MODERATION */}
        {activeTab === 'REPORTS' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-400" />
              <span>Incident Reports & Resident Moderation Queue</span>
            </h2>

            {reports.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs font-bold">
                ✓ No active incident reports pending review. Platform is healthy.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800">
                          {r.reason}
                        </span>
                        <span className="text-xs text-slate-400">
                          Reported User ID: <span className="text-white font-bold">{r.reportedId}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        "{r.details || 'No additional notes submitted.'}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUserAction(r.reportedId, 'BAN')}
                        className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold"
                      >
                        Ban Reported User
                      </button>
                      <button
                        onClick={() => handleReportAction(r.id, 'RESOLVE')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Dismiss Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
