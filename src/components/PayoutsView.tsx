/**
 * Payouts Processing View — Sahyog Admin
 * Escrow settlement with individual "Process payout" and batch clearance actions.
 */

import React, { useState } from 'react';
import {
  WalletCards,
  Search,
  CheckCircle2,
  Download,
  IndianRupee,
  Check,
  Building,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { PayoutRecord } from '../types';

interface PayoutsViewProps {
  payouts: PayoutRecord[];
  onProcessPayout: (id: string) => void;
  onBatchProcessPayouts: (ids: string[]) => void;
  onResetPayouts: () => void;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  payouts,
  onProcessPayout,
  onBatchProcessPayouts,
  onResetPayouts,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'cleared' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const filtered = payouts.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.payoutRef.toLowerCase().includes(q) ||
        p.workerName.toLowerCase().includes(q) ||
        p.workerId.toLowerCase().includes(q) ||
        p.trade.toLowerCase().includes(q) ||
        p.bankName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingPayouts = payouts.filter((p) => p.status === 'pending');
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.netPayable, 0);
  const totalCessAmount = pendingPayouts.reduce((sum, p) => sum + p.coopCess, 0);
  const clearedCount = payouts.filter((p) => p.status === 'cleared').length;

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProcessSingle = (p: PayoutRecord) => {
    onProcessPayout(p.id);
    setLastActionMessage(`Processed payout ${p.payoutRef} (₹${p.netPayable.toLocaleString('en-IN')}) for ${p.workerName}.`);
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  const handleBatchProcess = () => {
    const idsToProcess = selectedIds.length > 0 ? selectedIds : pendingPayouts.map((p) => p.id);
    if (idsToProcess.length === 0) return;
    onBatchProcessPayouts(idsToProcess);
    setSelectedIds([]);
    setLastActionMessage(`Batch processed ${idsToProcess.length} payouts to Delhi State Co-op Clearing Gateway.`);
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  const handleExportNeftCsv = () => {
    const headers = 'PayoutRef,WorkerId,WorkerName,Bank,AccountMasked,IFSC,UPI,Gross,Cess,NetPayable,Status\n';
    const rows = filtered
      .map(
        (p) =>
          `"${p.payoutRef}","${p.workerId}","${p.workerName}","${p.bankName}","${p.accountNumberMasked}","${p.ifsc}","${p.upiVpa}",${p.grossAmount},${p.coopCess},${p.netPayable},"${p.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sahyog_Escrow_Payouts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              Escrow Payouts Processing
            </h2>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#E5E8F2] text-[#14181F] tabular-nums">
              {pendingPayouts.length} pending clearance
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Direct bank clearing under Delhi State Co-operative Bank settlement gateway (T+1 Settlement)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {pendingPayouts.length > 0 && (
            <button
              onClick={handleBatchProcess}
              className="px-3 py-1.5 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[12px] font-medium rounded-[8px] transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {selectedIds.length > 0
                  ? `Process ${selectedIds.length} Selected Payouts`
                  : `Process All Eligible Payouts (${pendingPayouts.length})`}
              </span>
            </button>
          )}

          <button
            onClick={handleExportNeftCsv}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[12px] font-medium rounded-[8px] transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="hidden sm:inline">Bank Clearing File</span>
          </button>

          <button
            onClick={onResetPayouts}
            className="p-1.5 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#6B7280] hover:text-[#14181F] rounded-[8px] transition"
            title="Reload initial demo payouts"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {lastActionMessage && (
        <div className="text-[12px] bg-[#BCEDD7]/60 text-[#002116] px-3.5 py-2 rounded-[8px] flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#1F4D3D]" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* Escrow Ledger Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Total Pending Escrow</span>
          <div className="mt-2 text-[22px] font-bold tabular-nums tracking-tight text-[#14181F] font-mono">
            ₹{totalPendingAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">{pendingPayouts.length} artisans due</span>
        </div>

        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Co-op Welfare Cess (3%)</span>
          <div className="mt-2 text-[22px] font-bold tabular-nums tracking-tight text-[#1F4D3D] font-mono">
            ₹{totalCessAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">Federation social security reserve</span>
        </div>

        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Settled Disbursements</span>
          <div className="mt-2 text-[22px] font-bold tabular-nums tracking-tight text-[#14181F] tabular-nums">
            {clearedCount} cleared
          </div>
          <span className="text-[11px] text-[#1F4D3D] font-medium mt-1">DSCB Direct Clearing</span>
        </div>

        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Clearing Gateway</span>
          <div className="mt-2 text-[14px] font-bold text-[#14181F] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1F4D3D]"></span>
            <span>NACH / NEFT Direct</span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">Settlement Cycle: 16:00 IST</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
          {(['pending', 'cleared', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                filterStatus === status
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              {status === 'pending' && `Pending Clearance (${pendingPayouts.length})`}
              {status === 'cleared' && `Cleared (${clearedCount})`}
              {status === 'all' && 'All Cycles'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payout ref, artisan, bank..."
            className="w-full bg-[#FAFAF9] pl-8 pr-3 py-1.5 text-[12px] text-[#14181F] placeholder-[#6B7280] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#6B7280] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1F4D3D] mx-auto opacity-70" />
              <p className="font-semibold text-[#14181F] text-[14px]">No payouts in this queue</p>
              <p className="text-[12px]">All matching escrow disbursements have been processed.</p>
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
                  <th className="py-2.5 px-3">Payout Ref & Cycle</th>
                  <th className="py-2.5 px-3">Artisan & Trade</th>
                  <th className="py-2.5 px-3">Beneficiary Bank & Account</th>
                  <th className="py-2.5 px-3">Gross Earnings</th>
                  <th className="py-2.5 px-3">Co-op Cess & Fund</th>
                  <th className="py-2.5 px-3">Net Payable</th>
                  <th className="py-2.5 px-4 text-right">Statutory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E1] text-[13px]">
                {filtered.map((p) => {
                  const isPending = p.status === 'pending';
                  const isCleared = p.status === 'cleared';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#FAFAF9] transition-colors ${
                        isCleared ? 'bg-[#FAF8F2]/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded text-[#1F4D3D] focus:ring-[#1F4D3D]"
                        />
                      </td>

                      {/* Payout Ref */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-[#14181F]">{p.payoutRef}</div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">{p.period}</div>
                      </td>

                      {/* Artisan */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#14181F]">{p.workerName}</div>
                        <div className="text-[11px] text-[#6B7280] font-mono">
                          {p.workerId} · {p.trade}
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-3 px-3">
                        <div className="text-[12px] text-[#14181F] font-medium">{p.bankName}</div>
                        <div className="text-[11px] text-[#6B7280] font-mono">
                          {p.accountNumberMasked} · {p.ifsc}
                        </div>
                        <div className="text-[10px] text-[#6B7280] font-mono">{p.upiVpa}</div>
                      </td>

                      {/* Gross */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-[13px] tabular-nums text-[#14181F]">
                          ₹{p.grossAmount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Deductions */}
                      <td className="py-3 px-3">
                        <div className="text-[11px] text-[#6B7280] tabular-nums font-mono">
                          Cess: ₹{p.coopCess}
                        </div>
                        <div className="text-[11px] text-[#6B7280] tabular-nums font-mono">
                          Welfare: ₹{p.welfareDeduction}
                        </div>
                      </td>

                      {/* Net Payable */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-[14px] text-[#14181F] tabular-nums">
                          ₹{p.netPayable.toLocaleString('en-IN')}
                        </div>
                        {isCleared && (
                          <div className="text-[10px] text-[#1F4D3D] font-medium flex items-center gap-1">
                            <span className="text-[#C9A227] font-bold">✓</span> Cleared
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleProcessSingle(p)}
                            className="px-2.5 py-1 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[11px] font-medium rounded-[8px] transition focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
                          >
                            Process payout
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#C9A227] font-semibold bg-[#FDF8E8] border border-[#F3E8B6] px-2 py-0.5 rounded">
                            Disbursed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAFAF9] border-t border-[#E7E5E1] flex items-center justify-between text-[12px] text-[#6B7280]">
          <span>Direct escrow clearing certified under Section 19 of Cooperative Labour Act</span>
          <span className="font-mono text-[#1F4D3D]">
            DSCB Batch Settlement Daemon: READY
          </span>
        </div>
      </div>
    </div>
  );
};
