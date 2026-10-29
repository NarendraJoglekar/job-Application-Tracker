import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Document as AppDocument, DocumentType } from '../types';
import { DocumentModal } from '../components/modals/DocumentModal';
import {
  FileText,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Briefcase,
  Calendar,
  Download,
  Edit2,
  Trash2,
  FileCheck,
} from 'lucide-react';

interface DocumentsPageProps {
  onNavigateToApp: (appId: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigateToApp }) => {
  const { documents, applications, deleteDocument } = useData();

  const [layoutMode, setLayoutMode] = useState<'card' | 'table'>('card');
  const [modalOpen, setModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<AppDocument | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(8);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const nameMatch = doc.fileName.toLowerCase().includes(q);
      const labelMatch = doc.label.toLowerCase().includes(q);
      const typeMatch = doc.type.toLowerCase().includes(q);
      const notesMatch = (doc.versionNotes || '').toLowerCase().includes(q);
      const app = applications.find((a) => a.id === doc.applicationId);
      const appMatch = app
        ? app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
        : false;
      return nameMatch || labelMatch || typeMatch || notesMatch || appMatch;
    });
  }, [documents, applications, searchTerm]);

  const displayedDocs = filteredDocs.slice(0, pageSize);

  const handleEdit = (d: AppDocument) => {
    setDocToEdit(d);
    setModalOpen(true);
  };

  const simulateDownload = (fileName: string) => {
    const blob = new Blob(
      [`JobTrack Stored Document\nFile: ${fileName}\nExported securely from JobTrack Career Suite.`],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Documents & Resumes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store version-controlled resumes, tailored cover letters, and portfolios.
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
              setDocToEdit(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
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
          placeholder="Search by file name, version label, type..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Content */}
      {layoutMode === 'card' ? (
        /* CARD LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedDocs.map((doc) => {
            const app = applications.find((a) => a.id === doc.applicationId);
            return (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {doc.type}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{doc.fileName}</h3>
                        <p className="text-xs font-semibold text-slate-500">{doc.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => simulateDownload(doc.fileName)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-50"
                        title="Download file copy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {doc.versionNotes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      <strong>Notes:</strong> {doc.versionNotes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  {app ? (
                    <div
                      onClick={() => onNavigateToApp(app.id)}
                      className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 truncate max-w-[170px]"
                    >
                      <Briefcase className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{app.company}</span>
                    </div>
                  ) : (
                    <span>General</span>
                  )}

                  <span>{doc.submittedOn ? `Submitted ${doc.submittedOn}` : doc.fileSize || 'PDF'}</span>
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
                  <th className="py-3.5 px-4">File Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Version Label</th>
                  <th className="py-3.5 px-4">Linked Application</th>
                  <th className="py-3.5 px-4">Submitted On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {displayedDocs.map((doc) => {
                  const app = applications.find((a) => a.id === doc.applicationId);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{doc.fileName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{doc.label}</td>
                      <td className="py-3.5 px-4">
                        {app ? (
                          <button
                            onClick={() => onNavigateToApp(app.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            {app.company}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{doc.submittedOn || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => simulateDownload(doc.fileName)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
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

      {filteredDocs.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No documents match your query.
        </div>
      )}

      {/* "Show more" Paging Requirement */}
      {pageSize < filteredDocs.length && (
        <div className="p-3 text-center bg-white rounded-xl border border-slate-200">
          <button
            onClick={() => setPageSize((prev) => prev + 6)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
          >
            Show more documents ({filteredDocs.length - pageSize} remaining)
          </button>
        </div>
      )}

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        documentToEdit={docToEdit}
      />
    </div>
  );
};
