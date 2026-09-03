/**
 * Bookings Overview View — Sahyog Admin
 * Table of current and past bookings filterable by status with dispatch telemetry drawer.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  X,
  Phone,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { BookingRecord } from '../types';

interface BookingsViewProps {
  bookings: BookingRecord[];
  onUpdateStatus: (id: string, newStatus: BookingRecord['status']) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const filtered = bookings.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.refNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.workerName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.zone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = bookings.filter((b) => b.status === 'active').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const flaggedCount = bookings.filter((b) => b.status === 'flagged').length;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              Bookings & Dispatch Oversight
            </h2>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#E5E8F2] text-[#14181F] tabular-nums">
              {bookings.length} recorded today
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Active cooperative service dispatches, OTP verification timestamps, and escrow locking
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
          {(['all', 'active', 'completed', 'assigned', 'flagged'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition capitalize ${
                filterStatus === status
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              {status === 'all' && `All (${bookings.length})`}
              {status === 'active' && `Active (${activeCount})`}
              {status === 'completed' && `Completed (${completedCount})`}
              {status === 'assigned' && 'Assigned'}
              {status === 'flagged' && `Flagged (${flaggedCount})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ref, customer, artisan..."
            className="w-full bg-[#FAFAF9] pl-8 pr-3 py-1.5 text-[12px] text-[#14181F] placeholder-[#6B7280] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E5E1] bg-[#FAFAF9] text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">
                <th className="py-2.5 px-4">Booking Ref & Trade</th>
                <th className="py-2.5 px-3">Customer & Location</th>
                <th className="py-2.5 px-3">Assigned Guild Artisan</th>
                <th className="py-2.5 px-3">Time & Dispatch Status</th>
                <th className="py-2.5 px-3">Escrow Fee</th>
                <th className="py-2.5 px-3">OTP State</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E1] text-[13px]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAFAF9] transition-colors">
                  {/* Ref & Service */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-[#14181F]">{b.refNumber}</div>
                    <div className="text-[12px] text-[#414944] mt-0.5 truncate max-w-[200px]" title={b.category}>
                      {b.category}
                    </div>
                  </td>

                  {/* Customer & Location */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#14181F]">{b.customerName}</div>
                    <div className="text-[11px] text-[#6B7280] truncate max-w-[200px]" title={b.address}>
                      {b.address}
                    </div>
                  </td>

                  {/* Assigned Artisan */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#14181F]">{b.workerName}</div>
                    <div className="text-[11px] text-[#6B7280] font-mono">
                      {b.workerId} · {b.trade}
                    </div>
                  </td>

                  {/* Time & Dispatch Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                        b.status === 'active'
                          ? 'bg-[#FFE08E]/50 text-[#755B00]'
                          : b.status === 'completed'
                          ? 'bg-[#BCEDD7]/40 text-[#002116]'
                          : b.status === 'flagged'
                          ? 'bg-[#FFDAD6] text-[#93000A]'
                          : 'bg-[#F1F1EF] text-[#6B7280]'
                      }`}
                    >
                      {b.status}
                    </span>
                    <div className="text-[11px] text-[#6B7280] mt-0.5 tabular-nums">
                      {b.elapsedTime ? b.elapsedTime : b.scheduledTime.split('·')[1]}
                    </div>
                  </td>

                  {/* Escrow Fee */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#14181F] tabular-nums font-mono">
                      ₹{b.escrowAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#6B7280] tabular-nums">
                      Co-op Cess: ₹{b.coopFee}
                    </div>
                  </td>

                  {/* OTP State */}
                  <td className="py-3 px-3">
                    {b.otpVerified ? (
                      <span className="text-[11px] text-[#1F4D3D] font-medium flex items-center gap-1">
                        <span className="text-[#C9A227] font-bold">✓</span> OTP Validated
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting Arrival
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-2.5 py-1 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[11px] font-medium rounded-[8px] transition"
                    >
                      View Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-[#FAFAF9] border-t border-[#E7E5E1] text-[12px] text-[#6B7280]">
          Showing {filtered.length} of {bookings.length} federation bookings · Live GPS Telemetry Kiosk sync active
        </div>
      </div>

      {/* Booking Dispatch Telemetry Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
            onClick={() => setSelectedBooking(null)}
          />

          <div className="relative w-full max-w-md bg-white border-l border-[#E7E5E1] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between bg-[#FAFAF9]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#14181F]">
                    Dispatch Telemetry Dossier
                  </h3>
                  <span className="font-mono text-[11px] bg-[#BCEDD7]/50 text-[#002116] px-1.5 py-0.2 rounded">
                    {selectedBooking.refNumber}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Scheduled: {selectedBooking.scheduledTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-[#6B7280] hover:text-[#14181F] rounded hover:bg-[#E7E5E1]/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13px]">
              {/* Service & Customer Summary */}
              <div className="p-3.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-2">
                <div className="text-[14px] font-bold text-[#14181F]">
                  {selectedBooking.category}
                </div>
                <div className="text-[12px] text-[#6B7280] space-y-1">
                  <div>Customer: <strong className="text-[#14181F]">{selectedBooking.customerName}</strong> ({selectedBooking.customerPhone})</div>
                  <div>Address: <span className="text-[#14181F]">{selectedBooking.address}</span></div>
                  <div>Sector Zone: <span className="text-[#14181F]">{selectedBooking.zone}</span></div>
                </div>
              </div>

              {/* Assigned Artisan */}
              <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-1.5 bg-white">
                <div className="text-[10px] uppercase font-bold text-[#6B7280]">
                  Dispatched Artisan
                </div>
                <div className="text-[14px] font-bold text-[#14181F]">
                  {selectedBooking.workerName}
                </div>
                <div className="text-[12px] text-[#6B7280]">
                  ID: <span className="font-mono text-[#14181F]">{selectedBooking.workerId}</span> · Guild: {selectedBooking.trade}
                </div>
              </div>

              {/* Escrow Fee Ledger */}
              <div className="border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-2 bg-white text-[12px]">
                <div className="flex items-center justify-between font-bold text-[#14181F]">
                  <span>Total Escrow Deposited</span>
                  <span className="font-mono tabular-nums">
                    ₹{selectedBooking.escrowAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-1 pt-2 border-t border-[#E7E5E1] text-[#6B7280]">
                  <div className="flex justify-between">
                    <span>Artisan Gross Share (95%):</span>
                    <span className="font-mono text-[#14181F]">
                      ₹{(selectedBooking.escrowAmount - selectedBooking.coopFee).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooperative Welfare Fund (5%):</span>
                    <span className="font-mono text-[#1F4D3D]">
                      ₹{selectedBooking.coopFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Telemetry Timeline */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#6B7280]">
                  Dispatch Milestone Timeline
                </span>
                <div className="space-y-2 pl-2 border-l-2 border-[#1F4D3D] text-[12px]">
                  <div className="relative pl-3">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1F4D3D]"></span>
                    <div className="font-semibold text-[#14181F]">Order Logged on Citizen Platform</div>
                    <div className="text-[10px] text-[#6B7280]">{selectedBooking.scheduledTime}</div>
                  </div>

                  <div className="relative pl-3">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1F4D3D]"></span>
                    <div className="font-semibold text-[#14181F]">Assigned to Nearest Guild Artisan</div>
                    <div className="text-[10px] text-[#6B7280]">{selectedBooking.workerName} ({selectedBooking.workerId})</div>
                  </div>

                  <div className="relative pl-3">
                    <span
                      className={`absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full ${
                        selectedBooking.otpVerified ? 'bg-[#1F4D3D]' : 'bg-[#E7E5E1]'
                      }`}
                    ></span>
                    <div className="font-semibold text-[#14181F]">On-Site Arrival & 4-Digit OTP Confirmation</div>
                    <div className="text-[10px] text-[#6B7280]">
                      {selectedBooking.otpVerified ? 'Verified by Resident on Arrival' : 'Pending resident verification'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 border-t border-[#E7E5E1] bg-[#FAFAF9] flex items-center gap-2">
              {selectedBooking.status !== 'completed' && (
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'completed');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 py-2 px-3 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[12px] font-medium rounded-[8px] transition"
                >
                  Mark Completed & Release Escrow
                </button>
              )}
              {selectedBooking.status !== 'flagged' && (
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'flagged');
                    setSelectedBooking(null);
                  }}
                  className="py-2 px-3 bg-white hover:bg-red-50 border border-[#E7E5E1] text-[#93000A] text-[12px] font-medium rounded-[8px]"
                >
                  Flag Grievance
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="py-2 px-3 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] text-[12px] font-medium rounded-[8px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
