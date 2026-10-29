import React, { useState, useEffect } from 'react';
import { Offer, CURRENCIES } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Award, DollarSign, Calendar, Gift, FileText, Briefcase } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerToEdit?: Offer | null;
  defaultApplicationId?: string;
  onSuccess?: (offer: Offer) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  offerToEdit,
  defaultApplicationId,
  onSuccess,
}) => {
  const { applications, createOffer, updateOffer } = useData();

  const [applicationId, setApplicationId] = useState('');
  const [offerLabel, setOfferLabel] = useState('');
  const [annualBaseSalary, setAnnualBaseSalary] = useState<number | ''>(180000);
  const [bonus, setBonus] = useState<number | ''>(20000);
  const [equity, setEquity] = useState('$100,000 RSUs / 4 yrs');
  const [benefits, setBenefits] = useState('Full Health/Dental/Vision, $3k Setup, 401(k) Match');
  const [currency, setCurrency] = useState('USD ($)');
  const [responseDeadline, setResponseDeadline] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (offerToEdit) {
      setApplicationId(offerToEdit.applicationId);
      setOfferLabel(offerToEdit.offerLabel);
      setAnnualBaseSalary(offerToEdit.annualBaseSalary);
      setBonus(offerToEdit.bonus);
      setEquity(offerToEdit.equity || '');
      setBenefits(offerToEdit.benefits || '');
      setCurrency(offerToEdit.currency || 'USD ($)');
      setResponseDeadline(offerToEdit.responseDeadline || '');
      setNegotiationNotes(offerToEdit.negotiationNotes || '');
    } else {
      setApplicationId(defaultApplicationId || (applications[0]?.id ?? ''));
      setOfferLabel('Official Written Offer');
      setAnnualBaseSalary(180000);
      setBonus(20000);
      setEquity('$100,000 RSUs / 4 yrs');
      setBenefits('Full Health/Dental/Vision, $3k Setup, 401(k) Match');
      setCurrency('USD ($)');
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 10);
      setResponseDeadline(deadline.toISOString().split('T')[0]);
      setNegotiationNotes('');
    }
    setErrors({});
  }, [offerToEdit, defaultApplicationId, applications, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!applicationId) {
      errs.applicationId = 'Target application is required.';
    }
    if (!offerLabel.trim()) {
      errs.offerLabel = 'Offer label is required (e.g. Initial Offer).';
    }
    // Validation requirement: "Salary and bonus must be 0 or more. Show inline error messages on forms."
    if (annualBaseSalary === '' || Number(annualBaseSalary) < 0) {
      errs.annualBaseSalary = 'Annual base salary must be 0 or more.';
    }
    if (bonus === '' || Number(bonus) < 0) {
      errs.bonus = 'Bonus must be 0 or more.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      applicationId,
      offerLabel: offerLabel.trim(),
      annualBaseSalary: Math.max(0, Number(annualBaseSalary)),
      bonus: Math.max(0, Number(bonus)),
      equity: equity.trim(),
      benefits: benefits.trim(),
      currency,
      responseDeadline,
      negotiationNotes: negotiationNotes.trim(),
    };

    if (offerToEdit) {
      updateOffer(offerToEdit.id, payload);
      onClose();
      onSuccess?.({ ...offerToEdit, ...payload });
    } else {
      const created = createOffer(payload);
      onClose();
      onSuccess?.(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {offerToEdit ? 'Edit Offer Package' : 'Record Job Offer'}
              </h3>
              <p className="text-xs text-slate-300">
                Log compensation, bonuses, stock grants, and response deadline
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
                Offer Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={offerLabel}
                onChange={(e) => setOfferLabel(e.target.value)}
                placeholder="e.g. Initial Offer or Counter Offer"
                className={`w-full px-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.offerLabel
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.offerLabel && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.offerLabel}</p>}
            </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base salary validation: must be >= 0 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Base Salary <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={annualBaseSalary}
                  onChange={(e) => setAnnualBaseSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="180000"
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.annualBaseSalary
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.annualBaseSalary && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.annualBaseSalary}</p>
              )}
            </div>

            {/* Bonus validation: must be >= 0 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual / Signing Bonus <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="20000"
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.bonus
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.bonus && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.bonus}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Equity / Stock Options
              </label>
              <input
                type="text"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="e.g. $140,000 RSUs over 4 yrs or 0.25%"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Response Deadline Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={responseDeadline}
                  onChange={(e) => setResponseDeadline(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Benefits & Perks
            </label>
            <input
              type="text"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="e.g. 100% Medical, 401(k) match, $3k home office stipend"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Negotiation Notes & Counter Strategy
            </label>
            <textarea
              rows={3}
              value={negotiationNotes}
              onChange={(e) => setNegotiationNotes(e.target.value)}
              placeholder="Recruiter stated base is firm but signing bonus is flexible; asking for $15k more..."
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
              {offerToEdit ? 'Save Offer' : 'Save & Record Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
