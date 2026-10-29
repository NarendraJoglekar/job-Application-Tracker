import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Contact, ContactRelationship } from '../types';
import { ContactModal } from '../components/modals/ContactModal';
import {
  Users,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Edit2,
  Trash2,
} from 'lucide-react';

interface ContactsPageProps {
  onNavigateToApp: (appId: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onNavigateToApp }) => {
  const { contacts, applications, deleteContact } = useData();

  const [layoutMode, setLayoutMode] = useState<'card' | 'table'>('card');
  const [modalOpen, setModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(8);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(q);
      const emailMatch = (c.email || '').toLowerCase().includes(q);
      const companyMatch = (c.company || '').toLowerCase().includes(q);
      const relMatch = c.relationship.toLowerCase().includes(q);
      return nameMatch || emailMatch || companyMatch || relMatch;
    });
  }, [contacts, searchTerm]);

  const displayedContacts = filteredContacts.slice(0, pageSize);

  const handleEdit = (c: Contact) => {
    setContactToEdit(c);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Contacts & Rolodex
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep recruiters, referrals, hiring managers, and interviewers in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout switcher: Card vs Table */}
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
              setContactToEdit(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
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
          placeholder="Search by name, company, email, role..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Content */}
      {layoutMode === 'card' ? (
        /* CARD LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedContacts.map((c) => {
            const app = applications.find((a) => a.id === c.applicationId);
            return (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {c.relationship}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{c.name}</h3>
                      {c.company && (
                        <p className="text-xs font-semibold text-slate-500">{c.company}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50 cursor-pointer"
                        title="Edit contact"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteContact(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50 cursor-pointer"
                        title="Delete contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
                          {c.email}
                        </a>
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </div>

                  {c.details && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      {c.details}
                    </div>
                  )}
                </div>

                {app && (
                  <div
                    onClick={() => onNavigateToApp(app.id)}
                    className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                  >
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">
                      {app.company} — {app.role}
                    </span>
                  </div>
                )}
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
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Relationship</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Linked Application</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {displayedContacts.map((c) => {
                  const app = applications.find((a) => a.id === c.applicationId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {c.relationship}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{c.company || '—'}</td>
                      <td className="py-3.5 px-4">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
                            {c.email}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4">{c.phone || '—'}</td>
                      <td className="py-3.5 px-4">
                        {app ? (
                          <button
                            onClick={() => onNavigateToApp(app.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer text-left"
                          >
                            {app.company}
                          </button>
                        ) : (
                          'General'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteContact(c.id)}
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

      {filteredContacts.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No contacts found.
        </div>
      )}

      {/* "Show more" Paging Requirement */}
      {pageSize < filteredContacts.length && (
        <div className="p-3 text-center bg-white rounded-xl border border-slate-200">
          <button
            onClick={() => setPageSize((prev) => prev + 6)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
          >
            Show more contacts ({filteredContacts.length - pageSize} remaining)
          </button>
        </div>
      )}

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contactToEdit={contactToEdit}
      />
    </div>
  );
};
