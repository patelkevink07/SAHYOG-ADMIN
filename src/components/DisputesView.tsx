/**
 * Dispute Management View — Sahyog Admin
 * Literal queue of open grievances with inline resolution actions and side dossier inspection.
 */

import React, { useState } from 'react';
import {
  Scale,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Check,
} from 'lucide-react';
import { DisputeRecord } from '../types';

interface DisputesViewProps {
  disputes: DisputeRecord[];
  onOpenResolveModal: (dispute: DisputeRecord) => void;
  onQuickResolve: (disputeId: string, decision: string) => void;
}

export const DisputesView: React.FC<DisputesViewProps> = ({
  disputes,
  onOpenResolveModal,
  onQuickResolve,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = disputes.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.refNumber.toLowerCase().includes(q) ||
        d.bookingRef.toLowerCase().includes(q) ||
        d.complainantName.toLowerCase().includes(q) ||
        d.respondentName.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCount = disputes.filter((d) => d.status === 'open').length;
  const mediationCount = disputes.filter((d) => d.status === 'under_mediation').length;
  const resolvedCount = disputes.filter((d) => d.status === 'resolved').length;
  const totalContested = disputes
    .filter((d) => d.status !== 'resolved')
    .reduce((sum, d) => sum + d.escrowAmount, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              Dispute & Grievance Redressal
            </h2>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] tabular-nums">
              {openCount} open
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Cooperative statutory dispute mediation, escrow adjudication, and arbitration under Section 19
          </p>
        </div>

        <div className="text-[12px] text-[#6B7280] self-end sm:self-auto tabular-nums">
          Contested Escrow Pool:{' '}
          <strong className="text-[#14181F] font-mono">
            ₹{totalContested.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
          {(['open', 'under_mediation', 'resolved', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                filterStatus === status
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              {status === 'open' && `Open Disputes (${openCount})`}
              {status === 'under_mediation' && `In Mediation (${mediationCount})`}
              {status === 'resolved' && `Resolved (${resolvedCount})`}
              {status === 'all' && 'All Records'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dispute ref, booking, party..."
            className="w-full bg-[#FAFAF9] pl-8 pr-3 py-1.5 text-[12px] text-[#14181F] placeholder-[#6B7280] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
          />
        </div>
      </div>

      {/* Disputes Queue Table */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#6B7280] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1F4D3D] mx-auto opacity-70" />
              <p className="font-semibold text-[#14181F] text-[14px]">
                No disputes matching this queue filter
              </p>
              <p className="text-[12px]">All grievances in this category have been adjudicated.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E1] bg-[#FAFAF9] text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">
                  <th className="py-2.5 px-4">Dispute & Booking Ref</th>
                  <th className="py-2.5 px-3">Parties In Dispute</th>
                  <th className="py-2.5 px-3">Grievance Summary</th>
                  <th className="py-2.5 px-3">Contested Amount</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E1] text-[13px]">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAFAF9] transition-colors">
                    {/* Refs */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-[#14181F]">{d.refNumber}</div>
                      <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                        Booking: {d.bookingRef}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">{d.lodgedDate}</div>
                    </td>

                    {/* Parties */}
                    <td className="py-3 px-3">
                      <div className="text-[12px]">
                        <span className="text-[#6B7280]">By:</span>{' '}
                        <strong className="text-[#14181F]">{d.complainantName}</strong>
                      </div>
                      <div className="text-[12px] text-[#414944]">
                        <span className="text-[#6B7280]">Vs:</span> {d.respondentName}
                      </div>
                      <div className="text-[10px] text-[#6B7280] mt-0.5">Trade: {d.trade}</div>
                    </td>

                    {/* Summary */}
                    <td className="py-3 px-3 max-w-[280px]">
                      <div className="text-[12px] text-[#14181F] leading-snug line-clamp-2">
                        {d.summary}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#14181F] tabular-nums font-mono">
                        ₹{d.escrowAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">Held in Escrow</div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          d.severity === 'high'
                            ? 'bg-[#FFDAD6] text-[#93000A]'
                            : d.severity === 'medium'
                            ? 'bg-[#FFE08E]/50 text-[#755B00]'
                            : 'bg-[#F1F1EF] text-[#6B7280]'
                        }`}
                      >
                        {d.severity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                          d.status === 'open'
                            ? 'bg-red-50 text-[#93000A] font-semibold'
                            : d.status === 'under_mediation'
                            ? 'bg-[#FFE08E]/40 text-[#755B00]'
                            : 'bg-[#BCEDD7]/40 text-[#002116]'
                        }`}
                      >
                        {d.status === 'open'
                          ? 'Open'
                          : d.status === 'under_mediation'
                          ? 'In Mediation'
                          : 'Resolved'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {d.status !== 'resolved' ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => onOpenResolveModal(d)}
                            className="px-2.5 py-1 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[11px] font-medium rounded-[8px] transition focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => onOpenResolveModal(d)}
                            className="px-2 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[11px] font-medium rounded-[8px] transition"
                          >
                            Inspect Statements
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#1F4D3D] font-medium">
                          {d.resolutionDecision || 'Resolved'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-[#FAFAF9] border-t border-[#E7E5E1] text-[12px] text-[#6B7280]">
          Statutory Dispute Mediation Queue · Decisions recorded with binding officer signature
        </div>
      </div>
    </div>
  );
};
