import React, { useState, useEffect } from 'react';
import { Note } from '../../types';
import { useData } from '../../context/DataContext';
import { X, CheckSquare, Calendar, Briefcase } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
  defaultApplicationId?: string;
  onSuccess?: (note: Note) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  noteToEdit,
  defaultApplicationId,
  onSuccess,
}) => {
  const { applications, createNote, updateNote } = useData();

  const [applicationId, setApplicationId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [followUpDue, setFollowUpDue] = useState('');
  const [completed, setCompleted] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (noteToEdit) {
      setApplicationId(noteToEdit.applicationId);
      setTitle(noteToEdit.title);
      setBody(noteToEdit.body || '');
      setFollowUpDue(noteToEdit.followUpDue || '');
      setCompleted(noteToEdit.completed);
    } else {
      setApplicationId(defaultApplicationId || (applications[0]?.id ?? ''));
      setTitle('');
      setBody('');
      setFollowUpDue(new Date().toISOString().split('T')[0]);
      setCompleted(false);
    }
    setErrors({});
  }, [noteToEdit, defaultApplicationId, applications, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!applicationId) {
      errs.applicationId = 'Please select a linked application.';
    }
    if (!title.trim()) {
      errs.title = 'Title / next action is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      applicationId,
      title: title.trim(),
      body: body.trim(),
      followUpDue,
      completed,
    };

    if (noteToEdit) {
      updateNote(noteToEdit.id, payload);
      onClose();
      onSuccess?.({ ...noteToEdit, ...payload });
    } else {
      const created = createNote(payload);
      onClose();
      onSuccess?.(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {noteToEdit ? 'Edit Note & Action' : 'Add Note / Action Item'}
              </h3>
              <p className="text-xs text-slate-300">
                Track follow-ups, prep checklists, and critical reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Application <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm bg-white font-medium focus:outline-none focus:ring-2 cursor-pointer ${
                  errors.applicationId
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                }`}
              >
                {applications.length === 0 && <option value="">No applications found</option>}
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.company} — {app.role}
                  </option>
                ))}
              </select>
            </div>
            {errors.applicationId && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.applicationId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Title / Next Action <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Send thank-you note to recruiter"
              className={`w-full px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Follow-up Due Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={followUpDue}
                  onChange={(e) => setFollowUpDue(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="mt-5 flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100 w-full">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700">Mark as Completed</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Note Body / Details
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Key talking points, take-home repository URL, interview feedback..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {noteToEdit ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
