import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApplicationModal } from '../modals/ApplicationModal';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  CheckSquare,
  FileText,
  Award,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export type AppPage =
  | 'dashboard'
  | 'applications'
  | 'application-detail'
  | 'interviews'
  | 'contacts'
  | 'notes'
  | 'documents'
  | 'offers';

interface AppLayoutProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage, extraParam?: string) => void;
  selectedAppId?: string | null;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  const { user, signOut, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newAppModalOpen, setNewAppModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AppPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications' as AppPage, label: 'Applications', icon: Briefcase },
    { id: 'interviews' as AppPage, label: 'Interviews', icon: Calendar },
    { id: 'contacts' as AppPage, label: 'Contacts', icon: Users },
    { id: 'notes' as AppPage, label: 'Notes & Actions', icon: CheckSquare },
    { id: 'documents' as AppPage, label: 'Documents', icon: FileText },
    { id: 'offers' as AppPage, label: 'Offers', icon: Award },
  ];

  const handleNav = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0f172a] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">JobTrack</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewAppModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            aria-label="New application"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Clean White and Navy) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">JobTrack</span>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Career Manager
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <button
            onClick={() => setNewAppModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'applications' && currentPage === 'application-detail');
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-white border-l-4 border-blue-500 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Demo Switcher shortcut */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Owner-Only Data</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Signed in as <strong className="text-white">{user?.name}</strong>.
          </p>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 border border-slate-700">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#0f172a] capitalize">
              {currentPage === 'application-detail' ? 'Application Detail' : currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewAppModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Track Application</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global New Application Modal */}
      <ApplicationModal
        isOpen={newAppModalOpen}
        onClose={() => setNewAppModalOpen(false)}
        onSuccess={(app) => onNavigate('application-detail', app.id)}
      />
    </div>
  );
};
