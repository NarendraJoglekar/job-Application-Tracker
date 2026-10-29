import React, { useState, useEffect } from 'react';
import { Interview, InterviewFormat, INTERVIEW_FORMATS } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Calendar, Clock, Video, Users, FileText, Briefcase } from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewToEdit?: Interview | null;
  defaultApplicationId?: string;
  defaultDate?: string; // YYYY-MM-DD
  onSuccess?: (int: Interview) => void;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  interviewToEdit,
  defaultApplicationId,
  defaultDate,
  onSuccess,
}) => {
  const { applications, createInterview, updateInterview } = useData();

  const [applicationId, setApplicationId] = useState('');
  const [title, setTitle] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [locationOrUrl, setLocationOrUrl] = useState('');
  const [interviewers, setInterviewers] = useState('');
  const [prepNotes, setPrepNotes] = useState('');
  const [format, setFormat] = useState<InterviewFormat>('Video Call');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (interviewToEdit) {
      setApplicationId(interviewToEdit.applicationId);
      setTitle(interviewToEdit.title);
      setStartsAt(interviewToEdit.startsAt);
      setEndsAt(interviewToEdit.endsAt);
      setLocationOrUrl(interviewToEdit.locationOrUrl || '');
      setInterviewers(interviewToEdit.interviewers || '');
      setPrepNotes(interviewToEdit.prepNotes || '');
      setFormat(interviewToEdit.format || 'Video Call');
    } else {
      setApplicationId(defaultApplicationId || (applications[0]?.id ?? ''));
      setTitle('Technical Screen');
      const baseDate = defaultDate || new Date().toISOString().split('T')[0];
      setStartsAt(`${baseDate}T10:00`);
      setEndsAt(`${baseDate}T11:00`);
      setLocationOrUrl('https://meet.google.com/');
      setInterviewers('');
      setPrepNotes('');
      setFormat('Video Call');
    }
    setErrors({});
  }, [interviewToEdit, defaultApplicationId, defaultDate, applications, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!applicationId) {
      errs.applicationId = 'Please link this interview to an application.';
    }
    if (!title.trim()) {
      errs.title = 'Interview title is required.';
    }
    if (!startsAt) {
      errs.startsAt = 'Start time is required.';
    }
    if (!endsAt) {
      errs.endsAt = 'End time is required.';
    } else if (startsAt && new Date(endsAt) <= new Date(startsAt)) {
      // Mandatory Prompt Requirement: "Require the end time to be after the start time."
      errs.endsAt = 'End time must be after the start time.';
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
      startsAt,
      endsAt,
      locationOrUrl: locationOrUrl.trim(),
      interviewers: interviewers.trim(),
      prepNotes: prepNotes.trim(),
      format,
    };

    if (interviewToEdit) {
      updateInterview(interviewToEdit.id, payload);
      onClose();
      onSuccess?.({ ...interviewToEdit, ...payload });
    } else {
      const created = createInterview(payload);
      onClose();
      onSuccess?.(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Navy Header */}
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {interviewToEdit ? 'Edit Interview' : 'Schedule New Interview'}
              </h3>
              <p className="text-xs text-slate-300">
                {interviewToEdit ? 'Update session schedule & meeting details' : 'Add an upcoming round to your calendar'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Linked Application */}
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
                {applications.length === 0 && <option value="">No applications found - add one first</option>}
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.company} — {app.role} ({app.status})
                  </option>
                ))}
              </select>
            </div>
            {errors.applicationId && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.applicationId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Interview Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System Design Round"
                className={`w-full px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
            </div>

            {/* Format (Option Set) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as InterviewFormat)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {INTERVIEW_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start and End Times with strictly enforced validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Starts At <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.startsAt
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.startsAt && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.startsAt}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Ends At <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.endsAt
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.endsAt && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.endsAt}</p>}
            </div>
          </div>

          {/* Location or Meeting URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Location or Meeting URL
            </label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={locationOrUrl}
                onChange={(e) => setLocationOrUrl(e.target.value)}
                placeholder="https://zoom.us/j/... or Office address"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Interviewers */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Interviewers / Panelists
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={interviewers}
                onChange={(e) => setInterviewers(e.target.value)}
                placeholder="e.g. Sarah Connor (VP Eng), John Doe (Staff Architect)"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Preparation Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Preparation Notes
            </label>
            <textarea
              rows={3}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Questions to ask, topics to review, projects to showcase..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Footer Actions */}
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
              {interviewToEdit ? 'Save Interview' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
