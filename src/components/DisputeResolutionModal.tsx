/**
 * Dispute Resolution Drawer / Modal — Sahyog Admin
 * Quick statutory resolution for mediation officers with side-by-side statements.
 */

import React, { useState } from 'react';
import {
  Scale,
  X,
  AlertCircle,
  FileText,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { DisputeRecord } from '../types';

interface DisputeResolutionModalProps {
  dispute: DisputeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (disputeId: string, decision: string, notes: string) => void;
}

export const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({
  dispute,
  isOpen,
  onClose,
  onResolve,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!isOpen || !dispute) return null;

  const handleConfirm = () => {
    if (!selectedAction) return;
    onResolve(dispute.id, selectedAction, resolutionNotes);
    setSelectedAction(null);
    setResolutionNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Sheet */}
      <div className="relative w-full max-w-lg bg-white border-l border-[#E7E5E1] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#1F4D3D]" />
            <div>
              <h3 className="text-[15px] font-bold text-[#14181F] leading-tight">
                Dispute Mediation & Escrow Determination
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Cooperative Grievance Protocol · Ref: {dispute.refNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#14181F] rounded hover:bg-[#E7E5E1]/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13px]">
          {/* Dispute Summary Meta */}
          <div className="p-3.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Escrow In Question
              </span>
              <span className="text-[14px] font-bold text-[#14181F] tabular-nums font-mono">
                ₹{dispute.escrowAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[13px] font-semibold text-[#14181F]">
              {dispute.summary}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#6B7280] pt-1 border-t border-[#E7E5E1]">
              <span>Booking: <span className="font-mono text-[#14181F]">{dispute.bookingRef}</span></span>
              <span>Trade: <span className="text-[#14181F]">{dispute.trade}</span></span>
              <span>Lodged: <span className="text-[#14181F]">{dispute.lodgedDate}</span></span>
            </div>
          </div>

          {/* Statements Side-by-Side */}
          <div className="space-y-3">
            {/* Customer Statement */}
            <div className="p-3 bg-white border border-[#E7E5E1] rounded-[8px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Customer Statement ({dispute.complainantName})
                </span>
                <span className="text-[10px] bg-[#F1F1EF] px-1.5 py-0.5 rounded text-[#6B7280]">
                  Complainant
                </span>
              </div>
              <p className="text-[12px] text-[#14181F] leading-relaxed">
                "{dispute.customerStatement}"
              </p>
            </div>

            {/* Worker Statement */}
            <div className="p-3 bg-white border border-[#E7E5E1] rounded-[8px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1F4D3D]"></span>
                  Artisan Counter-Statement ({dispute.respondentName})
                </span>
                <span className="text-[10px] bg-[#BCEDD7]/40 px-1.5 py-0.5 rounded text-[#002116] font-medium">
                  Guild Member
                </span>
              </div>
              <p className="text-[12px] text-[#14181F] leading-relaxed">
                "{dispute.workerStatement}"
              </p>
            </div>

            {/* Evidence & Field Officer Notes */}
            <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-1">
              <span className="text-[11px] font-bold uppercase text-[#6B7280]">
                Field Dispatch Telemetry & Evidence
              </span>
              <p className="text-[12px] text-[#414944] leading-relaxed">
                {dispute.evidenceNotes}
              </p>
            </div>
          </div>

          {/* Resolution Options with Exact Verbs */}
          <div className="space-y-2 pt-2 border-t border-[#E7E5E1]">
            <span className="text-[11px] font-bold uppercase text-[#6B7280]">
              Statutory Resolution Actions
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction('Release 100% to Worker')}
                className={`w-full p-2.5 text-left border rounded-[8px] transition flex items-center justify-between text-[12px] ${
                  selectedAction === 'Release 100% to Worker'
                    ? 'border-[#1F4D3D] bg-[#F1F3FE] text-[#1F4D3D] font-semibold'
                    : 'border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#1F4D3D]" />
                  <span>Resolve: Release 100% to Worker</span>
                </div>
                <span className="font-mono tabular-nums text-[11px]">
                  ₹{dispute.escrowAmount.toLocaleString('en-IN')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('50/50 Compromise Settlement')}
                className={`w-full p-2.5 text-left border rounded-[8px] transition flex items-center justify-between text-[12px] ${
                  selectedAction === '50/50 Compromise Settlement'
                    ? 'border-[#1F4D3D] bg-[#F1F3FE] text-[#1F4D3D] font-semibold'
                    : 'border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#C9A227]" />
                  <span>Resolve: 50/50 Compromise Settlement</span>
                </div>
                <span className="font-mono tabular-nums text-[11px]">
                  ₹{(dispute.escrowAmount / 2).toLocaleString('en-IN')} each
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('Full Refund to Customer')}
                className={`w-full p-2.5 text-left border rounded-[8px] transition flex items-center justify-between text-[12px] ${
                  selectedAction === 'Full Refund to Customer'
                    ? 'border-[#1F4D3D] bg-[#F1F3FE] text-[#1F4D3D] font-semibold'
                    : 'border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#B91C1C]" />
                  <span>Resolve: Full Refund to Customer</span>
                </div>
                <span className="font-mono tabular-nums text-[11px]">
                  ₹{dispute.escrowAmount.toLocaleString('en-IN')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('Issue Co-op Disciplinary Warning')}
                className={`w-full p-2.5 text-left border rounded-[8px] transition flex items-center justify-between text-[12px] ${
                  selectedAction === 'Issue Co-op Disciplinary Warning'
                    ? 'border-[#B91C1C] bg-red-50 text-[#93000A] font-semibold'
                    : 'border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />
                  <span>Issue Co-op Disciplinary Warning</span>
                </div>
                <span className="text-[10px] text-[#6B7280]">Record in Registry</span>
              </button>
            </div>

            {/* Officer Settlement Commentary */}
            <div className="pt-2">
              <label className="block text-[11px] font-medium text-[#6B7280] mb-1">
                Mandatory Registrar Determination Notes:
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="State binding statutory justification under Delhi Co-operative Societies Act..."
                rows={2}
                className="w-full p-2 bg-white border border-[#E7E5E1] rounded-[6px] text-[12px] text-[#14181F] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E7E5E1] bg-[#FAFAF9] flex items-center gap-2">
          <button
            disabled={!selectedAction}
            onClick={handleConfirm}
            className={`flex-1 py-2.5 px-4 text-[13px] font-semibold rounded-[8px] transition flex items-center justify-center gap-1.5 ${
              selectedAction
                ? 'bg-[#1F4D3D] hover:bg-[#173C2F] text-white'
                : 'bg-[#E7E5E1] text-[#6B7280] cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Resolution</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[13px] font-medium rounded-[8px]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
