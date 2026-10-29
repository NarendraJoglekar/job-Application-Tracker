import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ApplicationModal } from '../components/modals/ApplicationModal';
import { ApplicationStatus } from '../types';
import {
  Briefcase,
  Flame,
  Award,
  Calendar,
  Plus,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  Video,
  ChevronRight,
  MapPin,
  DollarSign,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToApp: (appId: string) => void;
  onNavigateToSection: (section: 'applications' | 'interviews' | 'notes' | 'offers') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToApp,
  onNavigateToSection,
}) => {
  const {
    applications,
    metrics,
    upcomingInterviewsNext7Days,
    followUpsDue,
    toggleNoteComplete,
  } = useData();

  const [newAppModalOpen, setNewAppModalOpen] = useState(false);
  const [recentDisplayCount, setRecentDisplayCount] = useState(5);

  const statusBadgeColors: Record<ApplicationStatus, string> = {
    Wishlist: 'bg-slate-100 text-slate-700 border-slate-200',
    Applied: 'bg-blue-50 text-blue-700 border-blue-200',
    'Phone Screen': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Interview: 'bg-purple-50 text-purple-700 border-purple-200',
    Offer: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    Accepted: 'bg-emerald-600 text-white border-emerald-600 font-bold',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    Withdrawn: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.appliedOn || b.createdAt).getTime() - new Date(a.appliedOn || a.createdAt).getTime()
  );

  const displayedRecentApps = sortedApplications.slice(0, recentDisplayCount);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Pipeline Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time status of your career pipeline, scheduled interview rounds, and immediate action items.
          </p>
        </div>
        <button
          onClick={() => setNewAppModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-sm shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Applications */}
        <div
          onClick={() => onNavigateToSection('applications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#0f172a]">{metrics.totalApplications}</div>
          <div className="mt-2 text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>All career targets tracked</span>
            <span className="text-blue-600 font-bold">&rarr;</span>
          </div>
        </div>

        {/* Active Search */}
        <div
          onClick={() => onNavigateToSection('applications')}
          className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs hover:border-blue-500 hover:shadow-md transition cursor-pointer bg-blue-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Active Search
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-blue-900">{metrics.activeSearch}</div>
          <div className="mt-2 text-xs font-medium text-blue-700 flex items-center justify-between">
            <span>Applied, Screen, Interview, Offer</span>
            <span className="text-blue-700 font-bold">&rarr;</span>
          </div>
        </div>

        {/* Offers Received */}
        <div
          onClick={() => onNavigateToSection('offers')}
          className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer bg-emerald-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Offers Received
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-700">{metrics.offersCount}</div>
          <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center justify-between">
            <span>Compensation & Packages</span>
            <span className="text-emerald-700 font-bold">&rarr;</span>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div
          onClick={() => onNavigateToSection('interviews')}
          className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition cursor-pointer bg-indigo-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Upcoming Interviews
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-indigo-900">{metrics.upcomingInterviewsCount}</div>
          <div className="mt-2 text-xs font-medium text-indigo-700 flex items-center justify-between">
            <span>Rounds on calendar</span>
            <span className="text-indigo-700 font-bold">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications (Left) & Upcoming Interviews / Follow-ups (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Applications with "Show more" paging */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
              <p className="text-xs text-slate-500">Showing latest entries in your search</p>
            </div>
            <button
              onClick={() => onNavigateToSection('applications')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {displayedRecentApps.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No applications yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Start tracking roles you've applied for or wish to apply to.
              </p>
              <button
                onClick={() => setNewAppModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0f172a] text-white text-xs font-bold cursor-pointer"
              >
                Track First Application
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {displayedRecentApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigateToApp(app.id)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-blue-600 transition">
                      {app.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                          {app.role}
                        </span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-blue-600"
                            title="Open posting"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="font-semibold text-slate-700">{app.company}</span>
                        {app.location && <span>• {app.location}</span>}
                        {app.appliedOn && <span>• Applied {app.appliedOn}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                    {app.expectedSalary > 0 && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        ${app.expectedSalary.toLocaleString()}
                      </span>
                    )}

                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                        statusBadgeColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </div>
                </div>
              ))}

              {/* "Show more" Paging Requirement */}
              {recentDisplayCount < sortedApplications.length && (
                <div className="p-3 text-center bg-slate-50">
                  <button
                    onClick={() => setRecentDisplayCount((prev) => prev + 5)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
                  >
                    Show more applications ({sortedApplications.length - recentDisplayCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Interviews (Next 7 days) & Follow-ups Due */}
        <div className="space-y-8">
          {/* Interviews Next 7 Days */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Interviews in Next 7 Days</span>
                </h2>
                <p className="text-xs text-slate-500">Upcoming scheduled sessions</p>
              </div>
              <button
                onClick={() => onNavigateToSection('interviews')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Calendar &rarr;
              </button>
            </div>

            {upcomingInterviewsNext7Days.length === 0 ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No interviews scheduled in the next 7 days.
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingInterviewsNext7Days.map((int) => {
                  const startDate = new Date(int.startsAt);
                  const formattedDate = startDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                  const formattedTime = startDate.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={int.id}
                      onClick={() => onNavigateToSection('interviews')}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-700 mb-1">
                        <span>{formattedDate} at {formattedTime}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px]">
                          {int.format}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{int.title}</div>
                      {int.locationOrUrl && (
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 truncate">
                          <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{int.locationOrUrl}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Follow-ups Due */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Follow-ups Due</span>
                </h2>
                <p className="text-xs text-slate-500">Action items needing your attention</p>
              </div>
              <button
                onClick={() => onNavigateToSection('notes')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Notes &rarr;
              </button>
            </div>

            {followUpsDue.length === 0 ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                All clear! No urgent follow-ups pending.
              </div>
            ) : (
              <div className="space-y-2">
                {followUpsDue.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3"
                  >
                    <button
                      onClick={() => toggleNoteComplete(note.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                      title="Mark completed"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">{note.title}</div>
                      <div className="mt-1 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                        <span>Due: {note.followUpDue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={newAppModalOpen}
        onClose={() => setNewAppModalOpen(false)}
        onSuccess={(app) => onNavigateToApp(app.id)}
      />
    </div>
  );
};
