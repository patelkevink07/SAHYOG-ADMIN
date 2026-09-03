/**
 * Dashboard View — Sahyog Admin
 * Calm, high-density operations oversight matching reference layout.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Radio,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Clock,
  Send,
} from 'lucide-react';
import {
  WorkerVerification,
  ZoneAllocation,
  ForecastDay,
  NavigationSection,
} from '../types';

interface DashboardViewProps {
  verifications: WorkerVerification[];
  zones: ZoneAllocation[];
  forecastDays: ForecastDay[];
  openDisputesCount: number;
  totalEscrowPending: number;
  onApproveWorker: (worker: WorkerVerification) => void;
  onInspectWorker: (worker: WorkerVerification) => void;
  onRejectWorker: (worker: WorkerVerification) => void;
  onNavigate: (section: NavigationSection) => void;
  onBroadcastAlert: () => void;
  alertBroadcasted: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  verifications,
  zones,
  forecastDays,
  openDisputesCount,
  totalEscrowPending,
  onApproveWorker,
  onInspectWorker,
  onRejectWorker,
  onNavigate,
  onBroadcastAlert,
  alertBroadcasted,
}) => {
  const [sortOption, setSortOption] = useState<'score' | 'oldest' | 'police'>('score');
  const [activePage, setActivePage] = useState(1);
  const pageSize = 4;

  const pendingWorkers = verifications.filter((v) => v.status === 'pending');

  const sortedWorkers = [...pendingWorkers].sort((a, b) => {
    if (sortOption === 'score') return b.skillRegistryScore - a.skillRegistryScore;
    if (sortOption === 'police') {
      if (a.policeRecordStatus === 'in_review') return -1;
      return 1;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedWorkers.length / pageSize));
  const currentBatch = sortedWorkers.slice((activePage - 1) * pageSize, activePage * pageSize);

  return (
    <div className="space-y-6">
      {/* Section Header & Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
            Cooperative Operations Oversight
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Central Hub Allocation & Worker Credential Validation Queue · Shift Alpha
          </p>
        </div>
        <div className="text-[12px] text-[#6B7280] tabular-nums">
          Federation Session: <span className="font-medium text-[#14181F]">18-APR-2025 · 14:42 IST</span>
        </div>
      </div>

      {/* 1. Key Stat Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Stat 1: Active Workers */}
        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Active Workers</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[24px] font-bold tabular-nums tracking-tight text-[#14181F]">
              1,482
            </span>
            <span className="text-[11px] font-medium text-[#1F4D3D] tabular-nums bg-[#BCEDD7]/40 px-1.5 py-0.5 rounded">
              842 on job
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">63.7% allocation efficiency</span>
        </div>

        {/* Stat 2: Today's Bookings */}
        <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">Today's Bookings</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[24px] font-bold tabular-nums tracking-tight text-[#14181F]">
              328
            </span>
            <span className="text-[11px] font-medium text-[#755B00] tabular-nums bg-[#FFE08E]/40 px-1.5 py-0.5 rounded">
              42 active
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">98.2% on-time dispatch</span>
        </div>

        {/* Stat 3: Pending Verifications */}
        <div
          onClick={() => onNavigate('verification')}
          className="bg-white border border-[#1F4D3D]/30 rounded-[10px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#1F4D3D] transition"
        >
          <span className="text-[12px] font-medium text-[#1F4D3D] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pending Verifications
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[24px] font-bold tabular-nums tracking-tight text-[#14181F]">
              {pendingWorkers.length}
            </span>
            <span className="text-[11px] font-semibold text-[#93000A] bg-[#FFDAD6] px-1.5 py-0.5 rounded">
              Action Req.
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">Avg turnaround: 2.4 hrs</span>
        </div>

        {/* Stat 4: Open Disputes */}
        <div
          onClick={() => onNavigate('disputes')}
          className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#14181F] transition"
        >
          <span className="text-[12px] font-medium text-[#6B7280]">Open Disputes</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[24px] font-bold tabular-nums tracking-tight text-[#93000A]">
              {openDisputesCount}
            </span>
            <span className="text-[11px] font-medium text-[#6B7280] tabular-nums bg-[#F1F1EF] px-1.5 py-0.5 rounded">
              Mediation
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1">Escalated to Branch Officer</span>
        </div>

        {/* Stat 5: Escrow Payouts Ready */}
        <div
          onClick={() => onNavigate('payouts')}
          className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#1F4D3D] transition"
        >
          <span className="text-[12px] font-medium text-[#6B7280]">Escrow Payouts Ready</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[22px] font-bold tabular-nums tracking-tight text-[#14181F]">
              ₹{totalEscrowPending.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-[#1F4D3D] font-medium mt-1">
            Direct Bank Clearing T+1
          </span>
        </div>
      </div>

      {/* Main 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Priority Worker Verification Queue (8 Cols) */}
        <section className="lg:col-span-8 bg-white border border-[#E7E5E1] rounded-[10px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#E7E5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#1F4D3D]" />
              <div>
                <h3 className="text-[15px] font-bold text-[#14181F] leading-tight">
                  Priority Worker Verification Queue
                </h3>
                <p className="text-[12px] text-[#6B7280]">
                  Statutory verification of artisan credentials under Delhi Co-operative Societies Act
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] text-[#6B7280]">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-[#FAFAF9] text-[12px] font-medium border border-[#E7E5E1] rounded-[6px] py-1 px-2 text-[#14181F] focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
              >
                <option value="score">Highest Trade Score</option>
                <option value="oldest">Oldest Inbound</option>
                <option value="police">Police Verification Pending</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto flex-1">
            {currentBatch.length === 0 ? (
              <div className="p-8 text-center text-[#6B7280] text-[13px] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1F4D3D] mx-auto opacity-70" />
                <p className="font-semibold text-[#14181F]">All Queue Dossiers Verified</p>
                <p className="text-[12px]">No pending verification requests awaiting officer action.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E5E1] bg-[#FAFAF9] text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">
                    <th className="py-2.5 px-4">Worker & Trade</th>
                    <th className="py-2.5 px-3">Federation Branch</th>
                    <th className="py-2.5 px-3">Aadhaar & Skills</th>
                    <th className="py-2.5 px-3">Police Record</th>
                    <th className="py-2.5 px-3">Score & Exp</th>
                    <th className="py-2.5 px-4 text-right">Statutory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E1] text-[13px]">
                  {currentBatch.map((worker) => (
                    <tr key={worker.id} className="hover:bg-[#FAFAF9] transition-colors group">
                      {/* Worker & Trade */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#14181F]">{worker.name}</div>
                        <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <span>{worker.trade}</span>
                          <span>·</span>
                          <span className="font-mono text-[10px]">{worker.regId}</span>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-3 text-[#414944] text-[12px]">
                        {worker.branch}
                      </td>

                      {/* Aadhaar & Skills */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#14181F]">
                            <span className="text-[#C9A227] font-bold">✓</span> Aadhaar XML
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7280]">
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
                      </td>

                      {/* Score & Exp */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#14181F] tabular-nums">
                          {worker.skillRegistryScore}/100
                        </div>
                        <div className="text-[11px] text-[#6B7280] tabular-nums">
                          {worker.yearsExperience} yrs verified
                        </div>
                      </td>

                      {/* Statutory Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => onApproveWorker(worker)}
                            className="px-2.5 py-1 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[11px] font-medium rounded-[8px] transition focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onInspectWorker(worker)}
                            className="px-2 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[11px] font-medium rounded-[8px] transition"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => onRejectWorker(worker)}
                            className="px-1.5 py-1 text-[#6B7280] hover:text-[#B91C1C] text-[11px] transition rounded"
                            title="Reject Application"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-[#FAFAF9] border-t border-[#E7E5E1] flex items-center justify-between text-[12px] text-[#6B7280]">
            <span>
              Showing {currentBatch.length} of {pendingWorkers.length} pending artisan verification dossiers
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={activePage === 1}
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                className={`px-2 py-1 bg-white border border-[#E7E5E1] rounded text-[11px] font-medium transition ${
                  activePage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F1F1EF] text-[#14181F]'
                }`}
              >
                Previous
              </button>
              <span className="tabular-nums">
                {activePage} / {totalPages}
              </span>
              <button
                disabled={activePage === totalPages}
                onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                className={`px-2 py-1 bg-white border border-[#E7E5E1] rounded text-[11px] font-medium transition ${
                  activePage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#F1F1EF] text-[#14181F]'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Zone Dispatch Coverage & AI Demand Forecast (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card 1: Zone Dispatch Coverage */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#1F4D3D]" />
                <h3 className="text-[14px] font-bold text-[#14181F]">Zone Dispatch Coverage</h3>
              </div>
              <span className="text-[11px] text-[#1F4D3D] font-medium bg-[#BCEDD7]/40 px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>

            {/* Zone Density Meters */}
            <div className="mt-4 space-y-3">
              {zones.map((zone) => (
                <div key={zone.id}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#14181F] truncate pr-2">{zone.name}</span>
                    <span
                      className={`font-semibold tabular-nums text-right flex-shrink-0 ${
                        zone.deficitStatus === 'moderate_deficit'
                          ? 'text-[#755B00]'
                          : 'text-[#14181F]'
                      }`}
                    >
                      {zone.coveragePercentage}% {zone.deficitStatus === 'moderate_deficit' ? '(Moderate Deficit)' : 'coverage'}
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E8F2] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        zone.deficitStatus === 'moderate_deficit'
                          ? 'bg-[#C9A227]'
                          : 'bg-[#1F4D3D]'
                      }`}
                      style={{ width: `${zone.coveragePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6B7280] mt-0.5">
                    <span className="tabular-nums">{zone.onDuty} on duty</span>
                    <span className="tabular-nums">Cap: {zone.totalCapacity} workers</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Kiosks Footnote */}
            <div className="mt-4 p-2.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#6B7280]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4D3D]" />
                <span>All 4 Cooperative Depot kiosks online</span>
              </div>
              <button
                onClick={() => onNavigate('workforce-map')}
                className="font-medium text-[#1F4D3D] hover:underline focus:outline-none"
              >
                Full Map →
              </button>
            </div>
          </div>

          {/* Card 2: AI Demand Forecast */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1F4D3D]" />
                  <h3 className="text-[14px] font-bold text-[#14181F]">AI Demand Forecast</h3>
                </div>
                <span className="text-[10px] font-bold bg-[#F1F3FE] text-[#1F4D3D] px-2 py-0.5 rounded border border-[#E7E5E1]">
                  Gemini 1.5 Pro
                </span>
              </div>

              {/* Forecast Projection Header */}
              <div className="mt-3">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[12px] text-[#6B7280]">West & Central Projection (72 hrs)</span>
                  <span className="text-[12px] font-semibold text-[#B91C1C] tabular-nums">
                    +34% HVAC / Electrical
                  </span>
                </div>

                {/* SVG/Bar graphic representing days */}
                <div className="h-20 w-full bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] p-2 flex items-end justify-between gap-2">
                  {forecastDays.map((day) => {
                    const isPeak = day.surgeStatus === 'peak';
                    const isSurge = day.surgeStatus === 'surge';
                    const heightPercent = Math.min(100, Math.max(30, (day.electricalDemandIndex / 100) * 100));

                    return (
                      <div key={day.dayName} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                        <div
                          className={`w-full rounded-t transition-all ${
                            isPeak
                              ? 'bg-[#1F4D3D]'
                              : isSurge
                              ? 'bg-[#BCEDD7]'
                              : 'bg-[#E5E8F2]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                          title={`${day.dayName}: ${day.projectedBookings} bookings projected`}
                        />
                        <span
                          className={`text-[9px] tabular-nums ${
                            isPeak ? 'font-bold text-[#1F4D3D]' : 'text-[#6B7280]'
                          }`}
                        >
                          {day.dayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Plain Language Briefing Note */}
              <p className="mt-3 text-[12px] text-[#414944] leading-relaxed">
                <strong className="text-[#14181F]">Briefing:</strong> Expected surge in electrical & AC
                cooling service requests (+34%) in West Delhi sectors over the next 72 hours due to
                forecasted heatwave. Recommend pre-notifying 28 off-shift cooperative technicians.
              </p>
            </div>

            {/* Action Trigger */}
            <div className="mt-4 pt-3 border-t border-[#E7E5E1]">
              <button
                onClick={onBroadcastAlert}
                disabled={alertBroadcasted}
                className={`w-full py-2 px-3 text-[12px] font-medium rounded-[8px] transition flex items-center justify-center gap-1.5 ${
                  alertBroadcasted
                    ? 'bg-[#BCEDD7] text-[#002116]'
                    : 'bg-[#1F4D3D] hover:bg-[#173C2F] text-white focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]'
                }`}
              >
                {alertBroadcasted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Broadcast Sent to 28 Technicians</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast Alert to Certified Electricians</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
