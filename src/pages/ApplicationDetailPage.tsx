import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  ApplicationStatus,
  APPLICATION_STATUSES,
  Interview,
  Contact,
  Note,
  Document as AppDocument,
  Offer,
} from '../types';
import { ApplicationModal } from '../components/modals/ApplicationModal';
import { InterviewModal } from '../components/modals/InterviewModal';
import { ContactModal } from '../components/modals/ContactModal';
import { NoteModal } from '../components/modals/NoteModal';
import { DocumentModal } from '../components/modals/DocumentModal';
import { OfferModal } from '../components/modals/OfferModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  Edit2,
  Trash2,
  Plus,
  Video,
  Clock,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  Circle,
  FileText,
  Award,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  applicationId: string;
  onBack: () => void;
}

type TabType = 'overview' | 'interviews' | 'contacts' | 'notes' | 'documents' | 'offers';

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  applicationId,
  onBack,
}) => {
  const {
    getApplication,
    updateApplication,
    deleteApplication,
    getInterviewsForApp,
    getContactsForApp,
    getNotesForApp,
    getDocumentsForApp,
    getOffersForApp,
    deleteInterview,
    deleteContact,
    deleteNote,
    deleteDocument,
    deleteOffer,
    toggleNoteComplete,
  } = useData();

  const application = getApplication(applicationId);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modal open states
  const [editAppModalOpen, setEditAppModalOpen] = useState(false);
  const [deleteAppModalOpen, setDeleteAppModalOpen] = useState(false);

  // Sub-record modals
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<AppDocument | null>(null);

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<Offer | null>(null);

  if (!application) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Application not found</h3>
        <p className="text-xs text-slate-500 mt-1">
          This record may have been deleted or belongs to another user account.
        </p>
        <button
          onClick={onBack}
          className="mt-5 px-4 py-2 rounded-xl bg-[#0f172a] text-white text-xs font-bold cursor-pointer"
        >
          Return to Applications
        </button>
      </div>
    );
  }

  const linkedInterviews = getInterviewsForApp(application.id);
  const linkedContacts = getContactsForApp(application.id);
  const linkedNotes = getNotesForApp(application.id);
  const linkedDocuments = getDocumentsForApp(application.id);
  const linkedOffers = getOffersForApp(application.id);

  const totalCascadeCount =
    linkedInterviews.length +
    linkedContacts.length +
    linkedNotes.length +
    linkedDocuments.length +
    linkedOffers.length;

  const handleDeleteApplicationConfirm = () => {
    deleteApplication(application.id);
    onBack();
  };

  const tabs: { id: TabType; label: string; count?: number; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'interviews', label: 'Interviews', count: linkedInterviews.length, icon: Calendar },
    { id: 'contacts', label: 'Contacts', count: linkedContacts.length, icon: Users },
    { id: 'notes', label: 'Notes & Actions', count: linkedNotes.length, icon: CheckCircle2 },
    { id: 'documents', label: 'Documents', count: linkedDocuments.length, icon: FileText },
    { id: 'offers', label: 'Offers', count: linkedOffers.length, icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>
      </div>

      {/* Main Application Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0f172a] text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                  {application.role}
                </h1>
                {/* Status Dropdown to quickly change stage */}
                <select
                  value={application.status}
                  onChange={(e) =>
                    updateApplication(application.id, {
                      status: e.target.value as ApplicationStatus,
                    })
                  }
                  className="px-3 py-1 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-800 cursor-pointer focus:outline-none"
                >
                  {APPLICATION_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {application.company}
                </span>

                {application.location && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {application.location}
                  </span>
                )}

                {application.appliedOn && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied: {application.appliedOn}
                  </span>
                )}

                {application.jobUrl && (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Posting Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            {application.expectedSalary > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Target: ${application.expectedSalary.toLocaleString()}</span>
              </div>
            )}

            <button
              onClick={() => setEditAppModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Edit application"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDeleteAppModalOpen(true)}
              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 mt-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                Job Description & Role Summary
              </h3>
              {application.jobDescription ? (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                  {application.jobDescription}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No job description entered. Click "Edit" above to paste requirements or notes.
                </p>
              )}
            </div>

            {/* Quick Summary of linked items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Interviews</span>
                <div className="text-xl font-black text-slate-900 mt-1">{linkedInterviews.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Contacts</span>
                <div className="text-xl font-black text-slate-900 mt-1">{linkedContacts.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Notes & Tasks</span>
                <div className="text-xl font-black text-slate-900 mt-1">{linkedNotes.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Offers</span>
                <div className="text-xl font-black text-emerald-700 mt-1">{linkedOffers.length}</div>
              </div>
            </div>
          </div>

          {/* Right sidebar info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Application Meta
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Expected Annual Salary</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {application.expectedSalary > 0
                      ? `$${application.expectedSalary.toLocaleString()} ${application.currency}`
                      : 'Not specified'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Current Stage</span>
                  <span className="font-bold text-slate-800">{application.status}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Applied Date</span>
                  <span className="font-medium text-slate-700">{application.appliedOn || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Record Created</span>
                  <span className="font-medium text-slate-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INTERVIEWS TAB */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Scheduled Interviews ({linkedInterviews.length})
            </h3>
            <button
              onClick={() => {
                setInterviewToEdit(null);
                setInterviewModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>

          {linkedInterviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">
                No interviews scheduled for this role yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedInterviews.map((int) => {
                const start = new Date(int.startsAt);
                const end = new Date(int.endsAt);
                return (
                  <div
                    key={int.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {int.format}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">{int.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setInterviewToEdit(int);
                            setInterviewModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteInterview(int.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {start.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          • {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {int.locationOrUrl && (
                        <div className="flex items-center gap-2 truncate">
                          <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{int.locationOrUrl}</span>
                        </div>
                      )}

                      {int.interviewers && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>Panel: {int.interviewers}</span>
                        </div>
                      )}
                    </div>

                    {int.prepNotes && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                        <strong className="text-slate-800">Prep Notes:</strong> {int.prepNotes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. CONTACTS TAB */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recruiters & Contacts ({linkedContacts.length})
            </h3>
            <button
              onClick={() => {
                setContactToEdit(null);
                setContactModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>

          {linkedContacts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No contacts linked to this application yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {contact.relationship}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{contact.name}</h4>
                      {contact.company && (
                        <p className="text-xs text-slate-500">{contact.company}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setContactToEdit(contact);
                          setContactModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {contact.details && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      {contact.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. NOTES & ACTIONS TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Notes & Next Actions ({linkedNotes.length})
            </h3>
            <button
              onClick={() => {
                setNoteToEdit(null);
                setNoteModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>

          {linkedNotes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No notes recorded for this application.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border bg-white shadow-2xs flex items-start gap-3 transition ${
                    note.completed ? 'border-slate-200 bg-slate-50/50 opacity-80' : 'border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => toggleNoteComplete(note.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  >
                    {note.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          note.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setNoteToEdit(note);
                            setNoteModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {note.body && (
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{note.body}</p>
                    )}

                    {note.followUpDue && (
                      <div className="mt-2 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Follow-up due: {note.followUpDue}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Documents & Resumes ({linkedDocuments.length})
            </h3>
            <button
              onClick={() => {
                setDocToEdit(null);
                setDocModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document</span>
            </button>
          </div>

          {linkedDocuments.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No documents attached to this application.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {doc.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{doc.fileName}</h4>
                        <p className="text-xs font-semibold text-slate-500">{doc.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setDocToEdit(doc);
                          setDocModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
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

                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Submitted: {doc.submittedOn || 'Not recorded'}</span>
                    <span>{doc.fileSize || 'PDF'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. OFFERS TAB */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recorded Offers ({linkedOffers.length})
            </h3>
            <button
              onClick={() => {
                setOfferToEdit(null);
                setOfferModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Offer</span>
            </button>
          </div>

          {linkedOffers.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No offer details recorded yet.</p>
              <button
                onClick={() => {
                  setOfferToEdit(null);
                  setOfferModalOpen(true);
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Record Written Offer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedOffers.map((offer) => {
                const totalFirstYear = offer.annualBaseSalary + offer.bonus;
                return (
                  <div
                    key={offer.id}
                    className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-xs hover:border-emerald-400 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                          Official Offer
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">{offer.offerLabel}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setOfferToEdit(offer);
                            setOfferModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Numbers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Annual Base Salary
                        </span>
                        <div className="text-xl font-black text-emerald-700 mt-1">
                          ${offer.annualBaseSalary.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Bonus / Sign-on
                        </span>
                        <div className="text-xl font-black text-slate-900 mt-1">
                          ${offer.bonus.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase">
                          Total Year 1 Cash
                        </span>
                        <div className="text-xl font-black text-emerald-800 mt-1">
                          ${totalFirstYear.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {offer.equity && (
                        <div>
                          <strong className="text-slate-800 block mb-0.5">Equity / Stock:</strong>
                          <span className="text-slate-600">{offer.equity}</span>
                        </div>
                      )}
                      {offer.responseDeadline && (
                        <div>
                          <strong className="text-slate-800 block mb-0.5">Response Deadline:</strong>
                          <span className="text-amber-700 font-bold">{offer.responseDeadline}</span>
                        </div>
                      )}
                    </div>

                    {offer.benefits && (
                      <div className="mt-3 text-xs">
                        <strong className="text-slate-800 block mb-0.5">Benefits & Perks:</strong>
                        <span className="text-slate-600">{offer.benefits}</span>
                      </div>
                    )}

                    {offer.negotiationNotes && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                        <strong className="text-blue-900 block mb-1">Negotiation Notes:</strong>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {offer.negotiationNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ApplicationModal
        isOpen={editAppModalOpen}
        onClose={() => setEditAppModalOpen(false)}
        applicationToEdit={application}
      />

      {/* Cascade Deletion Confirmation */}
      <ConfirmDeleteModal
        isOpen={deleteAppModalOpen}
        onClose={() => setDeleteAppModalOpen(false)}
        onConfirm={handleDeleteApplicationConfirm}
        title={`Delete application for ${application.company}?`}
        description="Are you sure you want to permanently delete this application? This action cannot be undone."
        cascadeWarning={
          totalCascadeCount > 0
            ? `Cascade Protection: Deleting this application will also permanently delete ${totalCascadeCount} linked records (${linkedInterviews.length} interviews, ${linkedContacts.length} contacts, ${linkedNotes.length} notes, ${linkedDocuments.length} documents, and ${linkedOffers.length} offers).`
            : undefined
        }
      />

      <InterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        interviewToEdit={interviewToEdit}
        defaultApplicationId={application.id}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        contactToEdit={contactToEdit}
        defaultApplicationId={application.id}
      />

      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        noteToEdit={noteToEdit}
        defaultApplicationId={application.id}
      />

      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        documentToEdit={docToEdit}
        defaultApplicationId={application.id}
      />

      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        offerToEdit={offerToEdit}
        defaultApplicationId={application.id}
      />
    </div>
  );
};
