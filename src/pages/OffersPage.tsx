import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Offer } from '../types';
import { OfferModal } from '../components/modals/OfferModal';
import {
  Award,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Briefcase,
  DollarSign,
  Calendar,
  Gift,
  Edit2,
  Trash2,
  ArrowUpRight,
} from 'lucide-react';

interface OffersPageProps {
  onNavigateToApp: (appId: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigateToApp }) => {
  const { offers, applications, deleteOffer } = useData();

  const [layoutMode, setLayoutMode] = useState<'card' | 'table'>('card');
  const [modalOpen, setModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<Offer | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(8);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const labelMatch = offer.offerLabel.toLowerCase().includes(q);
      const equityMatch = (offer.equity || '').toLowerCase().includes(q);
      const benefitsMatch = (offer.benefits || '').toLowerCase().includes(q);
      const app = applications.find((a) => a.id === offer.applicationId);
      const appMatch = app
        ? app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
        : false;
      return labelMatch || equityMatch || benefitsMatch || appMatch;
    });
  }, [offers, applications, searchTerm]);

  const displayedOffers = filteredOffers.slice(0, pageSize);

  const handleEdit = (o: Offer) => {
    setOfferToEdit(o);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Job Offers & Compensation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare base pay, annual bonuses, equity vesting schedules, and deadlines.
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
              setOfferToEdit(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Offer</span>
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
          placeholder="Search by label, company, benefits, notes..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Content */}
      {layoutMode === 'card' ? (
        /* CARD LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedOffers.map((offer) => {
            const app = applications.find((a) => a.id === offer.applicationId);
            const totalFirstYear = offer.annualBaseSalary + offer.bonus;

            return (
              <div
                key={offer.id}
                className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-2xs hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        Offer Recorded
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1">{offer.offerLabel}</h3>
                      {app && (
                        <div
                          onClick={() => onNavigateToApp(app.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 mt-0.5"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>
                            {app.company} — {app.role}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Compensation Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Base Salary</span>
                      <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                        ${offer.annualBaseSalary.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Bonus</span>
                      <div className="text-base font-extrabold text-slate-800 mt-0.5">
                        ${offer.bonus.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Year 1 Cash</span>
                      <div className="text-base font-extrabold text-emerald-800 mt-0.5">
                        ${totalFirstYear.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs space-y-1">
                    {offer.equity && (
                      <div>
                        <strong className="text-slate-700">Equity:</strong>{' '}
                        <span className="text-slate-600">{offer.equity}</span>
                      </div>
                    )}
                    {offer.benefits && (
                      <div>
                        <strong className="text-slate-700">Benefits:</strong>{' '}
                        <span className="text-slate-600">{offer.benefits}</span>
                      </div>
                    )}
                  </div>

                  {offer.negotiationNotes && (
                    <div className="mt-3 p-3 bg-blue-50/50 rounded-xl text-xs text-slate-700 border border-blue-100">
                      <strong className="text-blue-900 block mb-0.5">Strategy:</strong>
                      {offer.negotiationNotes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Currency: {offer.currency}</span>
                  {offer.responseDeadline && (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Deadline: {offer.responseDeadline}</span>
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
                  <th className="py-3.5 px-4">Offer Label</th>
                  <th className="py-3.5 px-4">Company & Role</th>
                  <th className="py-3.5 px-4">Base Salary</th>
                  <th className="py-3.5 px-4">Bonus</th>
                  <th className="py-3.5 px-4">Equity</th>
                  <th className="py-3.5 px-4">Response Deadline</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {displayedOffers.map((offer) => {
                  const app = applications.find((a) => a.id === offer.applicationId);
                  return (
                    <tr key={offer.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{offer.offerLabel}</td>
                      <td className="py-3.5 px-4">
                        {app ? (
                          <button
                            onClick={() => onNavigateToApp(app.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer text-left"
                          >
                            {app.company} — {app.role}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ${offer.annualBaseSalary.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        ${offer.bonus.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{offer.equity || '—'}</td>
                      <td className="py-3.5 px-4">
                        {offer.responseDeadline ? (
                          <span className="font-bold text-amber-700">{offer.responseDeadline}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOffer(offer.id)}
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

      {filteredOffers.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No offers recorded yet.
        </div>
      )}

      {/* "Show more" Paging Requirement */}
      {pageSize < filteredOffers.length && (
        <div className="p-3 text-center bg-white rounded-xl border border-slate-200">
          <button
            onClick={() => setPageSize((prev) => prev + 6)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1 px-4 cursor-pointer"
          >
            Show more offers ({filteredOffers.length - pageSize} remaining)
          </button>
        </div>
      )}

      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offerToEdit={offerToEdit}
      />
    </div>
  );
};
