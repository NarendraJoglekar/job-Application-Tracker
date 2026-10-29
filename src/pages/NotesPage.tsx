import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Note } from '../types';
import { NoteModal } from '../components/modals/NoteModal';
import {
  CheckSquare,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Calendar,
  Briefcase,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
} from 'lucide-react';

interface NotesPageProps {
  onNavigateToApp: (appId: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({ onNavigateToApp }) => {
  const { notes, applications, deleteNote, toggleNoteComplete } = useData();

  const [layoutMode, setLayoutMode] = useState<'card' | 'table'>('card');
  const [modalOpen, setModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(8);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const titleMatch = n.title.toLowerCase().includes(q);
      const bodyMatch = n.body.toLowerCase().includes(q);
      const app = applications.find((a) => a.id === n.applicationId);
      const appMatch = app
        ? app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
        : false;
      return titleMatch || bodyMatch || appMatch;
    });
  }, [notes, applications, searchTerm]);

  const displayedNotes = filteredNotes.slice(0, pageSize);

  const handleEdit = (n: Note) => {
    setNoteToEdit(n);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Notes & Next Actions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track follow-ups, interview prep items, and application checklists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setLayoutMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                layoutMode === 'card'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                layoutMode === 'table'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              setNoteToEdit(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search title, action, company, details..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Content */}
      {layoutMode === 'card' ? (
        /* CARD LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedNotes.map((note) => {
            const app = applications.find((a) => a.id === note.applicationId);
            return (
              <div
                key={note.id}
                className={`p-5 rounded-2xl border bg-white shadow-2xs hover:border-slate-300 transition flex flex-col justify-between ${
                  note.completed ? 'opacity-75 bg-slate-50/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggleNoteComplete(note.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer flex-shrink-0"
                    >
                      {note.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-bold ${
                          note.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {note.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {note.body && (
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                      {note.body}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {app ? (
                    <div
                      onClick={() => onNavigateToApp(app.id)}
                      className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 truncate max-w-[160px]"
                    >
                      <Briefcase className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{app.company}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">General</span>
                  )}

                  {note.followUpDue && (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due {note.followUpDue}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LAYOUT */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">Done</th>
                  <th className="py-3.5 px-4">Title / Action</th>
                  <th className="py-3.5 px-4">Linked Application</th>
                  <th className="py-3.5 px-4">Follow-Up Due</th>
                  <th className="py-3.5 px-4">Body Excerpt</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {displayedNotes.map((note) => {
                  const app = applications.find((a) => a.id === note.applicationId);
                  return (
                    <tr
                      key={note.id}
                      className={`hover:bg-slate-50/80 transition ${
                        note.completed ? 'bg-slate-50/40 text-slate-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleNoteComplete(note.id)}
                          className="cursor-pointer"
                        >
                          {note.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <span className={note.completed ? 'line-through text-slate-400' : ''}>
                          {note.title}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {app ? (
                          <button
                            onClick={() => onNavigateToApp(app.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            {app.company} — {app.role}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {note.followUpDue ? (
                          <span className="font-semibold text-amber-700">{note.followUpDue}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {note.body || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(note)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No notes match your query.
        </div>
      )}

      {/* "Show more" Paging Requirement */}
      {pageSize < filteredNotes.length && (
        <div className="p-3 text-center bg-white rounded-xl border border-slate-200">
          <button
            onClick={() => setPageSize((prev) => prev + 6)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
          >
            Show more notes ({filteredNotes.length - pageSize} remaining)
          </button>
        </div>
      )}

      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        noteToEdit={noteToEdit}
      />
    </div>
  );
};
