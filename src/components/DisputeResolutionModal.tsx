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

          {/* Dispute Communication Thread (Messages) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7E5E1] pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Grievance Thread & Conversation ({dispute.messages?.length || 0} messages)
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">Live Firestore Thread</span>
            </div>

            {(!dispute.messages || dispute.messages.length === 0) ? (
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] text-[12px] text-[#6B7280] text-center">
                No conversation messages recorded for this dispute.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {dispute.messages.map((msg, index) => {
                  const isCustomer = msg.senderRole === 'customer';
                  const isWorker = msg.senderRole === 'worker';
                  const isAdmin = msg.senderRole === 'admin';

                  return (
                    <div
                      key={msg.id || index}
                      className={`p-3 rounded-[8px] border text-[12px] space-y-1 ${
                        isAdmin
                          ? 'bg-[#F1F3FE] border-[#1F4D3D]/30 text-[#1F4D3D]'
                          : isCustomer
                          ? 'bg-white border-[#E7E5E1] text-[#14181F]'
                          : 'bg-[#FAFAF9] border-[#E7E5E1] text-[#14181F]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCustomer
                                ? 'bg-blue-500'
                                : isWorker
                                ? 'bg-[#1F4D3D]'
                                : 'bg-amber-600'
                            }`}
                          />
                          <span className="text-[#14181F] font-bold text-[12px]">
                            {msg.senderName}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              isCustomer
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : isWorker
                                ? 'bg-[#BCEDD7]/40 text-[#002116] border border-[#1F4D3D]/20'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isCustomer
                              ? 'Complainant (Customer)'
                              : isWorker
                              ? 'Respondent (Artisan)'
                              : 'Officer (Admin)'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-[#14181F] whitespace-pre-wrap pt-0.5">
                        "{msg.message}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Evidence & Field Telemetry Notes if available */}
            {dispute.evidenceNotes && (
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#6B7280]">
                  Field Dispatch Telemetry & Evidence
                </span>
                <p className="text-[12px] text-[#414944] leading-relaxed">
                  {dispute.evidenceNotes}
                </p>
              </div>
            )}
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
