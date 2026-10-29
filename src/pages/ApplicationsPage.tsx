import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Application, ApplicationStatus, APPLICATION_STATUSES } from '../types';
import { ApplicationModal } from '../components/modals/ApplicationModal';
import {
  Briefcase,
  Kanban,
  List,
  Search,
  RotateCcw,
  Plus,
  ExternalLink,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  DollarSign,
} from 'lucide-react';

interface ApplicationsPageProps {
  onSelectApplication: (id: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onSelectApplication }) => {
  const { applications, updateApplication } = useData();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [targetColumnForAdd, setTargetColumnForAdd] = useState<ApplicationStatus>('Applied');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number | ''>('');

  // Pagination for list view ("Show more" paging)
  const [listPageSize, setListPageSize] = useState(8);

  // Drag-and-drop state
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ApplicationStatus | null>(null);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setMinSalaryFilter('');
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== 'ALL' || minSalaryFilter !== '');

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const roleMatch = app.role.toLowerCase().includes(query);
        const companyMatch = app.company.toLowerCase().includes(query);
        const locationMatch = (app.location || '').toLowerCase().includes(query);
        if (!roleMatch && !companyMatch && !locationMatch) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && app.status !== statusFilter) {
        return false;
      }

      // Min Salary
      if (minSalaryFilter !== '' && app.expectedSalary < Number(minSalaryFilter)) {
        return false;
      }

      return true;
    });
  }, [applications, searchTerm, statusFilter, minSalaryFilter]);

  // Group applications by status for Kanban Board
  const appsByStatus = useMemo(() => {
    const map: Record<ApplicationStatus, Application[]> = {
      Wishlist: [],
      Applied: [],
      'Phone Screen': [],
      Interview: [],
      Offer: [],
      Accepted: [],
      Rejected: [],
      Withdrawn: [],
    };
    filteredApps.forEach((app) => {
      if (map[app.status]) {
        map[app.status].push(app);
      }
    });
    return map;
  }, [filteredApps]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingAppId(id);
  };

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    if (dragOverCol !== status) {
      setDragOverCol(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const appId = e.dataTransfer.getData('text/plain') || draggingAppId;
    if (appId) {
      updateApplication(appId, { status: newStatus });
      setDraggingAppId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggingAppId(null);
    setDragOverCol(null);
  };

  const statusHeaderStyles: Record<
    ApplicationStatus,
    { badge: string; border: string; dot: string }
  > = {
    Wishlist: {
      badge: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
    Applied: {
      badge: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
    },
    'Phone Screen': {
      badge: 'bg-cyan-50 text-cyan-700',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500',
    },
    Interview: {
      badge: 'bg-purple-50 text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
    },
    Offer: {
      badge: 'bg-emerald-50 text-emerald-800',
      border: 'border-emerald-300',
      dot: 'bg-emerald-500',
    },
    Accepted: {
      badge: 'bg-emerald-600 text-white',
      border: 'border-emerald-600',
      dot: 'bg-white',
    },
    Rejected: {
      badge: 'bg-rose-50 text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-400',
    },
    Withdrawn: {
      badge: 'bg-amber-50 text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track candidates across stages. Drag cards across columns to update pipeline status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTargetColumnForAdd('Applied');
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filters Bar with Reset Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search role, company, location..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Min Salary Filter */}
          <div className="w-full sm:w-44 relative">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="number"
              min="0"
              step="10000"
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Min salary..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* View Content */}
      {viewMode === 'board' ? (
        /* KANBAN BOARD VIEW */
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[650px]">
          {APPLICATION_STATUSES.map((status) => {
            const columnApps = appsByStatus[status] || [];
            const isDropTarget = dragOverCol === status;
            const style = statusHeaderStyles[status];

            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
                className={`w-72 flex-shrink-0 bg-slate-100/70 rounded-2xl p-3 border transition-colors flex flex-col max-h-[800px] ${
                  isDropTarget
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-300'
                    : 'border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <span className="font-extrabold text-xs text-slate-800">{status}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {columnApps.length}
                    </span>
                    <button
                      onClick={() => {
                        setTargetColumnForAdd(status);
                        setModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-white"
                      title={`Add to ${status}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-[120px]">
                  {columnApps.length === 0 ? (
                    <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs">
                      <span>Drag cards here</span>
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectApplication(app.id)}
                        className={`p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-grab active:cursor-grabbing group ${
                          draggingAppId === app.id ? 'opacity-40 scale-98' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition leading-snug">
                            {app.role}
                          </span>
                        </div>

                        <div className="mt-1 text-xs font-semibold text-slate-600">
                          {app.company}
                        </div>

                        {app.location && (
                          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{app.location}</span>
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          {app.expectedSalary > 0 ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              ${app.expectedSalary.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No salary noted</span>
                          )}

                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {app.appliedOn || 'Recent'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW WITH "SHOW MORE" PAGING */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Role / Title</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Expected Salary</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredApps.slice(0, listPageSize).map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app.id)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                        <span>{app.role}</span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{app.company}</td>
                    <td className="py-3.5 px-4 text-slate-500">{app.location || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          statusHeaderStyles[app.status]?.badge
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.expectedSalary > 0 ? (
                        <span className="font-bold text-emerald-700">
                          ${app.expectedSalary.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{app.appliedOn || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(app.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No applications match your active filter criteria.
            </div>
          )}

          {/* "Show more" Paging Requirement */}
          {listPageSize < filteredApps.length && (
            <div className="p-3 text-center bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setListPageSize((prev) => prev + 8)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
              >
                Show more applications ({filteredApps.length - listPageSize} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Application Modal */}
      <ApplicationModal
        isOpen={modalOpen}
        initialStatus={targetColumnForAdd}
        onClose={() => setModalOpen(false)}
        onSuccess={(app) => onSelectApplication(app.id)}
      />
    </div>
  );
};
