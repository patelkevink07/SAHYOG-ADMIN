/**
 * Sahyog Admin — Types and Interfaces
 * Delhi Shramik Sahakari Federation Admin Portal
 * SIH26089 — Ministry of Cooperation Hackathon
 */

export type NavigationSection =
  | 'dashboard'
  | 'verification'
  | 'workforce-map'
  | 'bookings'
  | 'disputes'
  | 'payouts'
  | 'ai-forecast'
  | 'analytics';

export interface OfficerUser {
  id: string;
  name: string;
  badgeNumber?: string;
  branch: string;
  role: string;
  zone?: string;
  sessionTimestamp?: string;
}

export type OfficerProfile = OfficerUser;

export interface WorkerVerification {
  id: string;
  regId: string;
  name: string;
  trade: string;
  branch: string;
  aadhaarStatus: 'verified' | 'pending' | 'mismatch';
  aadhaarXmlHash: string;
  skillCertNumber: string;
  skillCertTitle: string;
  skillRegistryScore: number; // e.g. 94/100
  yearsExperience: number;
  policeRecordStatus: 'clear' | 'in_review' | 'flagged';
  policeCctnsRef: string;
  bankEscrowStatus: 'verified' | 'pending' | 'failed';
  bankName: string;
  bankAccountMasked: string;
  ifsc: string;
  phone: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'held';
  rejectionReason?: string;
  inspectionNotes?: string;
}

export interface BookingRecord {
  id: string;
  refNumber: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  trade: string;
  zone: string;
  address: string;
  category: string;
  status: 'active' | 'completed' | 'assigned' | 'flagged' | 'cancelled';
  escrowAmount: number;
  scheduledTime: string;
  elapsedTime?: string;
  startedAt?: string;
  otpVerified: boolean;
  coopFee: number;
}

export interface DisputeRecord {
  id: string;
  refNumber: string;
  bookingRef: string;
  lodgedBy: 'customer' | 'worker';
  complainantName: string;
  respondentName: string;
  trade: string;
  category: 'billing' | 'service_quality' | 'scope_incomplete' | 'delay' | 'damage';
  summary: string;
  escrowAmount: number;
  severity: 'high' | 'medium' | 'low';
  lodgedDate: string;
  status: 'open' | 'under_mediation' | 'resolved';
  customerStatement: string;
  workerStatement: string;
  evidenceNotes: string;
  resolutionDecision?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PayoutRecord {
  id: string;
  payoutRef: string;
  workerId: string;
  workerName: string;
  trade: string;
  bankName: string;
  accountNumberMasked: string;
  ifsc: string;
  upiVpa: string;
  grossAmount: number;
  coopCess: number; // typically 3%
  welfareDeduction: number; // ₹50 insurance fund
  netPayable: number;
  period: string;
  status: 'pending' | 'processing' | 'cleared' | 'held';
  clearedAt?: string;
}

export interface ZoneAllocation {
  id: string;
  name: string;
  sectorCode: string;
  region: 'north_west' | 'central' | 'south_west' | 'south_east' | 'east';
  totalCapacity: number;
  onDuty: number;
  onJob: number;
  standby: number;
  coveragePercentage: number;
  kioskStatus: 'online' | 'degraded' | 'offline';
  deficitStatus: 'adequate' | 'moderate_deficit' | 'surplus';
  primaryTrades: string[];
}

export interface ForecastDay {
  dayName: string;
  dateStr: string;
  projectedBookings: number;
  electricalDemandIndex: number;
  plumbingDemandIndex: number;
  careDemandIndex: number;
  surgeStatus: 'normal' | 'surge' | 'peak';
  temperature?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  actionType: 'approve_worker' | 'reject_worker' | 'resolve_dispute' | 'process_payout' | 'batch_payout' | 'reallocate_workforce';
  itemRef: string;
  details: string;
  statutoryRuleRef: string;
}
