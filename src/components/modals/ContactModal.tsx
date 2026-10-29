import React, { useState, useEffect } from 'react';
import { Contact, ContactRelationship, CONTACT_RELATIONSHIPS } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Users, Mail, Phone, Building2, Briefcase } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
  defaultApplicationId?: string;
  onSuccess?: (contact: Contact) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactToEdit,
  defaultApplicationId,
  onSuccess,
}) => {
  const { applications, createContact, updateContact } = useData();

  const [applicationId, setApplicationId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [details, setDetails] = useState('');
  const [relationship, setRelationship] = useState<ContactRelationship>('Recruiter');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (contactToEdit) {
      setApplicationId(contactToEdit.applicationId || '');
      setName(contactToEdit.name);
      setEmail(contactToEdit.email || '');
      setPhone(contactToEdit.phone || '');
      setCompany(contactToEdit.company || '');
      setDetails(contactToEdit.details || '');
      setRelationship(contactToEdit.relationship || 'Recruiter');
    } else {
      setApplicationId(defaultApplicationId || (applications[0]?.id ?? ''));
      const defaultApp = applications.find((a) => a.id === defaultApplicationId) || applications[0];
      setCompany(defaultApp ? defaultApp.company : '');
      setName('');
      setEmail('');
      setPhone('');
      setDetails('');
      setRelationship('Recruiter');
    }
    setErrors({});
  }, [contactToEdit, defaultApplicationId, applications, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = 'Contact name is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      applicationId: applicationId || undefined,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      details: details.trim(),
      relationship,
    };

    if (contactToEdit) {
      updateContact(contactToEdit.id, payload);
      onClose();
      onSuccess?.({ ...contactToEdit, ...payload });
    } else {
      const created = createContact(payload);
      onClose();
      onSuccess?.(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {contactToEdit ? 'Edit Contact' : 'Add Professional Contact'}
              </h3>
              <p className="text-xs text-slate-300">
                Keep recruiter, referral, and hiring manager details at hand
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
              Contact Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Chen"
              className={`w-full px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as ContactRelationship)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {CONTACT_RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Linear"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Linked Application
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={applicationId}
                onChange={(e) => {
                  setApplicationId(e.target.value);
                  const matched = applications.find((a) => a.id === e.target.value);
                  if (matched && !company) setCompany(matched.company);
                }}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="">General / Not tied to specific role</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.company} — {app.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Details / Notes
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Met on LinkedIn, referred by Jane, key interview advice..."
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
              {contactToEdit ? 'Save Contact' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
