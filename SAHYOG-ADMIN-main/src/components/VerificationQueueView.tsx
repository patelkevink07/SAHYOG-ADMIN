/**
 * Worker Verification Queue View — Sahyog Admin
 * Literal queue layout where staff work through applicants top-to-bottom with inline actions.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { WorkerVerification } from '../types';

interface VerificationQueueViewProps {
  verifications: WorkerVerification[];
  onApprove: (worker: WorkerVerification) => void;
  onReject: (worker: WorkerVerification, reason?: string) => void;
  onInspect: (worker: WorkerVerification) => void;
  onBatchApproveClear: () => void;
  onResetVerifications: () => void;
}

export const VerificationQueueView: React.FC<VerificationQueueViewProps> = ({
  verifications,
  onApprove,
  onReject,
  onInspect,
  onBatchApproveClear,
  onResetVerifications,
}) => {
  const [filterTrade, setFilterTrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const trades = [
    'all',
    'Plumbing',
    'Electrical & Wiring',
    'Geriatric Aid & Care',
    'Carpentry & Joinery',
    'HVAC & Refrigeration',
    'Home Sanitization',
    'Masonry & Tiling',
  ];

  const filtered = verifications.filter((worker) => {
    if (filterStatus !== 'all' && worker.status !== filterStatus) return false;
    if (filterTrade !== 'all' && worker.trade !== filterTrade) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        worker.name.toLowerCase().includes(q) ||
        worker.regId.toLowerCase().includes(q) ||
        worker.trade.toLowerCase().includes(q) ||
        worker.branch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = verifications.filter((v) => v.status === 'pending').length;
  const clearPendingCount = verifications.filter(
    (v) => v.status === 'pending' && v.policeRecordStatus === 'clear'
  ).length;

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((w) => w.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              Worker Verification Queue
            </h2>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#E5E8F2] text-[#14181F] tabular-nums">
              {pendingCount} pending
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Credential validation, biometric Aadhaar XML, trade certification, and CCTNS police screening
          </p>
        </div>

        {/* Batch Action Toolbar */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {clearPendingCount > 0 && filterStatus === 'pending' && (
            <button
              onClick={onBatchApproveClear}
              className="px-3 py-1.5 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[12px] font-medium rounded-[8px] transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve All Clear ({clearPendingCount})</span>
            </button>
          )}

          <button
            onClick={onResetVerifications}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#6B7280] hover:text-[#14181F] text-[12px] font-medium rounded-[8px] transition flex items-center gap-1"
            title="Reload initial verification queue demo records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Queue</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                filterStatus === status
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              {status === 'pending' && `Pending (${pendingCount})`}
              {status === 'approved' &&
                `Approved (${verifications.filter((v) => v.status === 'approved').length})`}
              {status === 'rejected' &&
                `Rejected (${verifications.filter((v) => v.status === 'rejected').length})`}
              {status === 'all' && 'All Records'}
            </button>
          ))}
        </div>

        {/* Trade Selector & Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
          >
            {trades.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Trades' : t}
              </option>
            ))}
          </select>

          <div className="relative w-full max-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queue..."
              className="w-full bg-[#FAFAF9] pl-8 pr-3 py-1.5 text-[12px] text-[#14181F] placeholder-[#6B7280] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
            />
          </div>
        </div>
      </div>

      {/* Main Queue Table */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#6B7280] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1F4D3D] mx-auto opacity-70" />
              <p className="font-semibold text-[#14181F] text-[14px]">No applicant records in this view</p>
              <p className="text-[12px]">All matching worker dossiers have been processed.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E1] bg-[#FAFAF9] text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">
                  <th className="py-2.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-[#1F4D3D] focus:ring-[#1F4D3D]"
                    />
                  </th>
                  <th className="py-2.5 px-3">Applicant & Trade</th>
                  <th className="py-2.5 px-3">Federation Branch</th>
                  <th className="py-2.5 px-3">Identity & Skill Credentials</th>
                  <th className="py-2.5 px-3">Police Record (CCTNS)</th>
                  <th className="py-2.5 px-3">Score & Experience</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Statutory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E1] text-[13px]">
                {filtered.map((worker) => {
                  const isApproved = worker.status === 'approved';
                  const isRejected = worker.status === 'rejected';
                  const isPending = worker.status === 'pending';

                  return (
                    <tr
                      key={worker.id}
                      className={`hover:bg-[#FAFAF9] transition-colors ${
                        isApproved ? 'bg-[#FAF8F2]/40' : isRejected ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(worker.id)}
                          onChange={() => toggleSelect(worker.id)}
                          className="rounded text-[#1F4D3D] focus:ring-[#1F4D3D]"
                        />
                      </td>

                      {/* Applicant & Trade */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#14181F] flex items-center gap-1.5">
                          <span>{worker.name}</span>
                          {isApproved && (
                            <span className="text-[#C9A227] font-bold text-[13px]" title="Approved Guild Worker">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-[#414944]">{worker.trade}</span>
                          <span>·</span>
                          <span className="font-mono text-[10px] bg-[#F1F1EF] px-1 py-0.2 rounded">
                            {worker.regId}
                          </span>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-3 text-[#414944] text-[12px]">
                        {worker.branch}
                      </td>

                      {/* Identity & Skill Credentials */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span className="inline-flex items-center gap-1 font-medium text-[#14181F]">
                            <span className="text-[#C9A227] font-bold">✓</span> DigiLocker Aadhaar XML
                          </span>
                          <span className="text-[#6B7280] truncate max-w-[220px]" title={worker.skillCertTitle}>
                            <span className="text-[#C9A227] font-bold">✓</span> {worker.skillCertNumber}
                          </span>
                        </div>
                      </td>

                      {/* Police Record */}
                      <td className="py-3 px-3">
                        {worker.policeRecordStatus === 'clear' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#BCEDD7]/40 text-[#002116]">
                            <span className="text-[#1F4D3D] text-[12px]">✓</span> Clear
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFE08E]/50 text-[#755B00]">
                            <Clock className="w-3 h-3" /> In Review
                          </span>
                        )}
                        <div className="text-[10px] text-[#6B7280] font-mono mt-0.5 truncate max-w-[130px]">
                          {worker.policeCctnsRef}
                        </div>
                      </td>

                      {/* Score & Experience */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#14181F] tabular-nums">
                          {worker.skillRegistryScore}/100
                        </div>
                        <div className="text-[11px] text-[#6B7280] tabular-nums">
                          {worker.yearsExperience} yrs verified
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#755B00] bg-[#FFE08E]/40 px-2 py-0.5 rounded">
                            Pending Decision
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C9A227] bg-[#FDF8E8] border border-[#F3E8B6] px-2 py-0.5 rounded">
                            Approved & Active
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#93000A] bg-[#FFDAD6] px-2 py-0.5 rounded">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Statutory Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {isPending && (
                            <>
                              <button
                                onClick={() => onApprove(worker)}
                                className="px-2.5 py-1 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[11px] font-medium rounded-[8px] transition focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onInspect(worker)}
                                className="px-2 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[11px] font-medium rounded-[8px] transition"
                              >
                                Inspect
                              </button>
                              <button
                                onClick={() => onReject(worker)}
                                className="px-1.5 py-1 text-[#6B7280] hover:text-[#B91C1C] text-[11px] transition rounded"
                                title="Reject Application"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => onInspect(worker)}
                              className="px-2.5 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[11px] font-medium rounded-[8px] transition"
                            >
                              View Dossier
                            </button>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => onInspect(worker)}
                              className="px-2.5 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#6B7280] text-[11px] font-medium rounded-[8px] transition"
                            >
                              Reconsider
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-[#FAFAF9] border-t border-[#E7E5E1] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#6B7280] gap-2">
          <span>
            Displaying {filtered.length} artisan verification files · Statutory Rule 42 compliance audit active
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#1F4D3D]">
              UIDAI Aadhaar XML Offline Validator: ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
