import React, { useState, useEffect } from 'react';
import { Document as AppDocument, DocumentType, DOCUMENT_TYPES } from '../../types';
import { useData } from '../../context/DataContext';
import { X, FileText, Upload, Calendar, Briefcase } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: AppDocument | null;
  defaultApplicationId?: string;
  onSuccess?: (doc: AppDocument) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  documentToEdit,
  defaultApplicationId,
  onSuccess,
}) => {
  const { applications, createDocument, updateDocument } = useData();

  const [applicationId, setApplicationId] = useState('');
  const [fileName, setFileName] = useState('');
  const [label, setLabel] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [submittedOn, setSubmittedOn] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<DocumentType>('Resume');
  const [fileSize, setFileSize] = useState('240 KB');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (documentToEdit) {
      setApplicationId(documentToEdit.applicationId);
      setFileName(documentToEdit.fileName);
      setLabel(documentToEdit.label);
      setVersionNotes(documentToEdit.versionNotes || '');
      setSubmittedOn(documentToEdit.submittedOn || new Date().toISOString().split('T')[0]);
      setType(documentToEdit.type || 'Resume');
      setFileSize(documentToEdit.fileSize || '240 KB');
    } else {
      setApplicationId(defaultApplicationId || (applications[0]?.id ?? ''));
      setFileName('Resume_Updated_2026.pdf');
      setLabel('v1.0 - Default');
      setVersionNotes('');
      setSubmittedOn(new Date().toISOString().split('T')[0]);
      setType('Resume');
      setFileSize('320 KB');
    }
    setErrors({});
  }, [documentToEdit, defaultApplicationId, applications, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!applicationId) {
      errs.applicationId = 'Target application is required.';
    }
    if (!fileName.trim()) {
      errs.fileName = 'File name is required.';
    }
    if (!label.trim()) {
      errs.label = 'Label / Version is required (e.g. v2 - Systems).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      applicationId,
      fileName: fileName.trim(),
      label: label.trim(),
      versionNotes: versionNotes.trim(),
      submittedOn,
      type,
      fileSize,
    };

    if (documentToEdit) {
      updateDocument(documentToEdit.id, payload);
      onClose();
      onSuccess?.({ ...documentToEdit, ...payload });
    } else {
      const created = createDocument(payload);
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {documentToEdit ? 'Edit Document' : 'Upload Application Document'}
              </h3>
              <p className="text-xs text-slate-300">
                Resumes, tailored cover letters, portfolios, and letters
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Document Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {DOCUMENT_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Submitted On Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={submittedOn}
                  onChange={(e) => setSubmittedOn(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* File Picker / Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              File Attachment <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. My_Staff_Resume_v2.pdf"
                className={`flex-1 px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.fileName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse</span>
                <input type="file" onChange={handleFakeFileUpload} className="hidden" />
              </label>
            </div>
            {errors.fileName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fileName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Label / Version <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. v3.2 - Systems & Concurrency Focus"
              className={`w-full px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.label
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.label && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.label}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Version Notes
            </label>
            <textarea
              rows={3}
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              placeholder="Tailored bullet points for this specific role, custom cover letter paragraph..."
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
              {documentToEdit ? 'Save Document' : 'Add Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
