import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus, APPLICATION_STATUSES, CURRENCIES } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Briefcase, Building2, MapPin, Globe, DollarSign, Calendar } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit?: Application | null;
  initialStatus?: ApplicationStatus;
  onSuccess?: (app: Application) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  applicationToEdit,
  initialStatus = 'Applied',
  onSuccess,
}) => {
  const { createApplication, updateApplication } = useData();

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [appliedOn, setAppliedOn] = useState(new Date().toISOString().split('T')[0]);
  const [expectedSalary, setExpectedSalary] = useState<number | ''>(150000);
  const [currency, setCurrency] = useState('USD ($)');
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (applicationToEdit) {
      setRole(applicationToEdit.role);
      setCompany(applicationToEdit.company);
      setLocation(applicationToEdit.location || '');
      setJobUrl(applicationToEdit.jobUrl || '');
      setJobDescription(applicationToEdit.jobDescription || '');
      setAppliedOn(applicationToEdit.appliedOn || new Date().toISOString().split('T')[0]);
      setExpectedSalary(applicationToEdit.expectedSalary ?? 0);
      setCurrency(applicationToEdit.currency || 'USD ($)');
      setStatus(applicationToEdit.status || 'Applied');
    } else {
      setRole('');
      setCompany('');
      setLocation('');
      setJobUrl('');
      setJobDescription('');
      setAppliedOn(new Date().toISOString().split('T')[0]);
      setExpectedSalary(150000);
      setCurrency('USD ($)');
      setStatus(initialStatus);
    }
    setErrors({});
  }, [applicationToEdit, initialStatus, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!role.trim()) {
      errs.role = 'Role / Job title is required.';
    }
    if (!company.trim()) {
      errs.company = 'Company name is required.';
    }
    if (expectedSalary !== '' && Number(expectedSalary) < 0) {
      errs.expectedSalary = 'Expected salary must be 0 or more.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      role: role.trim(),
      company: company.trim(),
      location: location.trim(),
      jobUrl: jobUrl.trim(),
      jobDescription: jobDescription.trim(),
      appliedOn,
      expectedSalary: expectedSalary === '' ? 0 : Math.max(0, Number(expectedSalary)),
      currency,
      status,
    };

    if (applicationToEdit) {
      updateApplication(applicationToEdit.id, payload);
      onClose();
      onSuccess?.({ ...applicationToEdit, ...payload });
    } else {
      const created = createApplication(payload);
      onClose();
      onSuccess?.(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Navy Header */}
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {applicationToEdit ? 'Edit Application' : 'Track New Application'}
              </h3>
              <p className="text-xs text-slate-300">
                {applicationToEdit
                  ? `Updating details for ${applicationToEdit.role} at ${applicationToEdit.company}`
                  : 'Add a target role to your personal hiring pipeline'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Role / Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.role
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.role && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.role}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Google"
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.company
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.company && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status (Option Set) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Work Mode
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Applied on */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Applied On Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={appliedOn}
                  onChange={(e) => setAppliedOn(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Expected Annual Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Annual Salary
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="150000"
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.expectedSalary
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.expectedSalary && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.expectedSalary}</p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Posting URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/role"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description / Notes
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste key responsibilities, requirements, team details, or highlights..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed resize-none"
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
              {applicationToEdit ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
