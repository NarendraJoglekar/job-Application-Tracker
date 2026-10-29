import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Interview, InterviewFormat } from '../types';
import { InterviewModal } from '../components/modals/InterviewModal';
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Clock,
  Users,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Briefcase,
} from 'lucide-react';

interface InterviewsPageProps {
  onNavigateToApp: (appId: string) => void;
}

export const InterviewsPage: React.FC<InterviewsPageProps> = ({ onNavigateToApp }) => {
  const { interviews, applications, deleteInterview } = useData();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [selectedDateForNew, setSelectedDateForNew] = useState<string>('');

  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [listPageSize, setListPageSize] = useState(8);

  const prevMonth = () => {
    setCurrentMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonthDate(new Date());
  };

  // Build calendar matrix
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // First day of month (0 = Sun, 1 = Mon, ...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Total days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Map interviews to date strings (YYYY-MM-DD)
  const interviewsByDate = useMemo(() => {
    const map: Record<string, Interview[]> = {};
    interviews.forEach((item) => {
      const dateStr = item.startsAt.split('T')[0];
      if (!map[dateStr]) {
        map[dateStr] = [];
      }
      map[dateStr].push(item);
    });
    return map;
  }, [interviews]);

  // Filtered interviews for List View
  const filteredInterviews = useMemo(() => {
    return [...interviews]
      .filter((int) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        const app = applications.find((a) => a.id === int.applicationId);
        const titleMatch = int.title.toLowerCase().includes(query);
        const formatMatch = int.format.toLowerCase().includes(query);
        const appMatch = app
          ? app.company.toLowerCase().includes(query) || app.role.toLowerCase().includes(query)
          : false;
        return titleMatch || formatMatch || appMatch;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [interviews, applications, searchTerm]);

  // Calendar cells
  const calendarCells = useMemo(() => {
    const cells: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${prevY}-${pad(prevM)}-${pad(day)}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Trailing days from next month to complete grid (up to 35 or 42)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextM = month + 2 > 12 ? 1 : month + 2;
      const nextY = month + 2 > 12 ? year + 1 : year;
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${nextY}-${pad(nextM)}-${pad(day)}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    return cells;
  }, [year, month, firstDayIndex, daysInMonth, daysInPrevMonth]);

  const handleEditInterview = (interview: Interview) => {
    setInterviewToEdit(interview);
    setModalOpen(true);
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDateForNew(dateStr);
    setInterviewToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Interviews & Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Month schedule, session links, and strict start/end time validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
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
              setInterviewToEdit(null);
              setSelectedDateForNew('');
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* CALENDAR VIEW WITH MONTH NAVIGATION & POPUP TO EDIT INTERVIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Calendar Month Navigation Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{monthName}</h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Day Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[500px]">
            {calendarCells.map((cell, idx) => {
              const dayInterviews = interviewsByDate[cell.dateStr] || [];
              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(cell.dateStr)}
                  className={`min-h-[110px] p-2 transition flex flex-col justify-between group cursor-pointer ${
                    cell.isCurrentMonth ? 'bg-white hover:bg-blue-50/20' : 'bg-slate-50/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        cell.isToday
                          ? 'bg-blue-600 text-white font-black'
                          : 'text-slate-700 group-hover:text-blue-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {dayInterviews.length > 0 && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">
                        {dayInterviews.length}
                      </span>
                    )}
                  </div>

                  {/* Interview items on this date */}
                  <div className="space-y-1 overflow-hidden flex-1">
                    {dayInterviews.map((int) => {
                      const startTime = new Date(int.startsAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      });
                      const app = applications.find((a) => a.id === int.applicationId);

                      return (
                        <div
                          key={int.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Mandatory Requirement: "a popup to edit an interview"
                            handleEditInterview(int);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 text-[11px] hover:bg-indigo-100 transition shadow-2xs truncate"
                          title={`${int.title} (${startTime}) - Click to edit`}
                        >
                          <div className="font-bold truncate leading-tight">{int.title}</div>
                          <div className="text-[10px] text-indigo-700 truncate">
                            {startTime} {app ? `• ${app.company}` : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW WITH "SHOW MORE" PAGING */
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, format, company..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filteredInterviews.slice(0, listPageSize).map((int) => {
              const start = new Date(int.startsAt);
              const end = new Date(int.endsAt);
              const app = applications.find((a) => a.id === int.applicationId);

              return (
                <div
                  key={int.id}
                  className="p-5 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase">
                        {start.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-base font-black leading-none">{start.getDate()}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{int.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {int.format}
                        </span>
                      </div>

                      {app && (
                        <div
                          onClick={() => onNavigateToApp(app.id)}
                          className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>
                            {app.company} — {app.role}
                          </span>
                        </div>
                      )}

                      <div className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} -{' '}
                          {end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>

                        {int.locationOrUrl && (
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <Video className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{int.locationOrUrl}</span>
                          </span>
                        )}

                        {int.interviewers && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>{int.interviewers}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleEditInterview(int)}
                      className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      title="Edit interview"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteInterview(int.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      title="Delete interview"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredInterviews.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">No interviews match your search.</div>
            )}

            {/* "Show more" Paging Requirement */}
            {listPageSize < filteredInterviews.length && (
              <div className="p-3 text-center bg-slate-50">
                <button
                  onClick={() => setListPageSize((prev) => prev + 8)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
                >
                  Show more interviews ({filteredInterviews.length - listPageSize} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit / Add Interview Popup Modal */}
      <InterviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        interviewToEdit={interviewToEdit}
        defaultDate={selectedDateForNew}
      />
    </div>
  );
};
