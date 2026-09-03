/**
 * Inspection Drawer Component — Sahyog Admin
 * Statutory Dossier Inspection side drawer for worker verification.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Check,
  AlertCircle,
  FileCheck,
  Building2,
  Lock,
  User,
  Phone,
  Calendar,
} from 'lucide-react';
import { WorkerVerification } from '../types';

interface InspectionDrawerProps {
  worker: WorkerVerification | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (worker: WorkerVerification) => void;
  onReject: (worker: WorkerVerification, reason: string) => void;
  onHold: (worker: WorkerVerification) => void;
}

export const InspectionDrawer: React.FC<InspectionDrawerProps> = ({
  worker,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onHold,
}) => {
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('Skill certificate does not meet Level 2 guild standard');

  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-[#E7E5E1] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#1F4D3D]" />
            <div>
              <h3 className="text-[15px] font-bold text-[#14181F] leading-tight">
                Statutory Dossier Inspection
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                National Skill Registry & Identity Clearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#14181F] rounded hover:bg-[#E7E5E1]/60 transition focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13px]">
          {/* Worker Profile Card */}
          <div className="p-3.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                Applicant Dossier
              </span>
              <span className="text-[11px] font-mono text-[#1F4D3D] bg-[#BCEDD7]/50 px-1.5 py-0.5 rounded font-medium">
                {worker.regId}
              </span>
            </div>
            <h4 className="text-[16px] font-bold text-[#14181F] mt-1">
              {worker.name}
            </h4>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              {worker.trade} · {worker.branch}
            </p>

            <div className="mt-2.5 pt-2 border-t border-[#E7E5E1] grid grid-cols-2 gap-2 text-[11px] text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-[#14181F] font-mono">{worker.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>{worker.submissionDate}</span>
              </div>
            </div>
          </div>

          {/* 1. DigiLocker Aadhaar XML Verification */}
          <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14181F] flex items-center gap-1.5 text-[13px]">
                <span className="text-[#C9A227] font-bold">✓</span> DigiLocker Aadhaar XML
              </span>
              <span className="text-[11px] text-[#1F4D3D] bg-[#BCEDD7]/40 px-2 py-0.5 rounded font-medium">
                Verified Hash
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              UIDAI Cryptographic Signature matches applicant identity, biometric token, and registered mobile hash.
            </p>
            <div className="p-2 bg-[#FAFAF9] rounded text-[11px] font-mono text-[#414944] border border-[#E7E5E1] break-all">
              {worker.aadhaarXmlHash}
            </div>
          </div>

          {/* 2. National Skill Development Corporation (NSDC) */}
          <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14181F] flex items-center gap-1.5 text-[13px]">
                <span className="text-[#C9A227] font-bold">✓</span> Skill Assessment Registry
              </span>
              <span className="text-[12px] font-bold text-[#14181F] tabular-nums">
                Score: {worker.skillRegistryScore}/100
              </span>
            </div>
            <div className="text-[12px] text-[#14181F] font-medium">
              {worker.skillCertTitle}
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Certificate ID: <span className="font-mono text-[#14181F]">{worker.skillCertNumber}</span> · {worker.yearsExperience} years verified experience in trade guild.
            </p>
          </div>

          {/* 3. Bank Account & Escrow Clearance */}
          <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#14181F] flex items-center gap-1.5 text-[13px]">
                <span className="text-[#C9A227] font-bold">✓</span> Cooperative Escrow Bank Check
              </span>
              <span className="text-[11px] text-[#1F4D3D] font-medium bg-[#BCEDD7]/40 px-2 py-0.5 rounded">
                Penny Drop Pass
              </span>
            </div>
            <div className="text-[12px] text-[#6B7280] space-y-0.5">
              <div>
                Beneficiary: <span className="text-[#14181F] font-medium">Name Match 100%</span>
              </div>
              <div>
                Bank: <span className="text-[#14181F]">{worker.bankName}</span>
              </div>
              <div className="font-mono text-[11px]">
                A/C: {worker.bankAccountMasked} · IFSC: {worker.ifsc}
              </div>
            </div>
          </div>

          {/* 4. Police Verification Status */}
          <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-1 bg-[#FAFAF9]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280]">
              Law Enforcement Registry (CCTNS)
            </span>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[12px] font-medium text-[#14181F]">
                Status: {worker.policeRecordStatus === 'clear' ? 'Verified Clear' : worker.policeRecordStatus === 'in_review' ? 'In Review at Local Station' : 'Flagged'}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  worker.policeRecordStatus === 'clear'
                    ? 'bg-[#BCEDD7]/50 text-[#002116]'
                    : 'bg-[#FFE08E]/50 text-[#755B00]'
                }`}
              >
                {worker.policeRecordStatus === 'clear' ? 'Clear' : 'Pending'}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono">
              Ref: {worker.policeCctnsRef}
            </p>
          </div>

          {/* Reject Reason Selection UI if rejecting */}
          {rejecting && (
            <div className="p-3 border border-[#B91C1C]/40 bg-[#FFDAD6]/30 rounded-[8px] space-y-2">
              <span className="text-[11px] font-bold text-[#93000A]">
                Specify Statutory Rejection Ground:
              </span>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-white border border-[#E7E5E1] rounded-[6px] p-1.5 text-[12px] text-[#14181F] focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
              >
                <option>Skill certificate does not meet Level 2 guild standard</option>
                <option>DigiLocker biometric hash signature mismatch</option>
                <option>Adverse law enforcement / police verification record</option>
                <option>Bank account beneficiary name mismatch with Aadhaar</option>
                <option>Incomplete proof of residential trade experience</option>
              </select>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onReject(worker, rejectReason);
                    setRejecting(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#B91C1C] text-white text-[12px] font-medium rounded-[6px] hover:bg-red-800 transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setRejecting(false)}
                  className="px-2.5 py-1.5 bg-white border border-[#E7E5E1] text-[12px] text-[#14181F] rounded-[6px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-[#E7E5E1] bg-[#FAFAF9] flex flex-col gap-2">
          {!rejecting && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onApprove(worker);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[13px] font-semibold rounded-[8px] transition flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Issue Co-op Card</span>
              </button>

              <button
                onClick={() => setRejecting(true)}
                className="py-2.5 px-3 bg-white hover:bg-red-50 border border-[#E7E5E1] text-[#93000A] text-[13px] font-medium rounded-[8px] transition"
                title="Reject with statutory grounds"
              >
                Reject
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[13px] font-medium rounded-[8px] transition"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
