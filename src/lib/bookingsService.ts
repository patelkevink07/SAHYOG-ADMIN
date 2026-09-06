import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { BookingRecord } from '../types';

export type FirestoreBookingStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'flagged';

export enum FirestoreOperationType {
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  UPDATE = 'update',
}

export function handleFirestoreError(
  error: unknown,
  operationType: FirestoreOperationType,
  path: string | null
): never {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Maps Firestore booking status to Sahyog Admin BookingRecord status:
 * - requested / accepted -> 'assigned'
 * - in_progress -> 'active'
 * - completed -> 'completed'
 * - cancelled / rejected -> 'cancelled'
 * - flagged -> 'flagged'
 */
export function mapFirestoreStatusToAdmin(rawStatus?: string): BookingRecord['status'] {
  const s = String(rawStatus || '').toLowerCase().trim();
  switch (s) {
    case 'requested':
    case 'accepted':
      return 'assigned';
    case 'in_progress':
      return 'active';
    case 'completed':
      return 'completed';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    case 'flagged':
      return 'flagged';
    default:
      return 'assigned';
  }
}

/**
 * Reverse mapping: Sahyog Admin BookingRecord status to Firestore status:
 * - 'assigned' -> 'accepted'
 * - 'active' -> 'in_progress'
 * - 'completed' -> 'completed'
 * - 'cancelled' -> 'cancelled'
 * - 'flagged' -> 'flagged'
 */
export function mapAdminStatusToFirestore(adminStatus: BookingRecord['status']): FirestoreBookingStatus {
  switch (adminStatus) {
    case 'assigned':
      return 'accepted';
    case 'active':
      return 'in_progress';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'flagged':
      return 'flagged';
    default:
      return 'accepted';
  }
}

/**
 * Formats a date/timestamp field safely for UI presentation
 */
function formatTimeField(val: unknown): string {
  if (!val) return 'Today · Scheduled';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    // Firestore Timestamp
    const ts = val as { toDate?: () => Date; seconds?: number };
    if (typeof ts.toDate === 'function') {
      const d = ts.toDate();
      return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (typeof ts.seconds === 'number') {
      const d = new Date(ts.seconds * 1000);
      return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    }
  }
  return 'Today · Scheduled';
}

/**
 * Maps a single Firestore document to a BookingRecord
 */
export function mapDocToBookingRecord(docSnap: DocumentSnapshot<DocumentData>): BookingRecord {
  const data = docSnap.data() || {};
  const id = docSnap.id;

  const rawStatus = data.status;
  const status = mapFirestoreStatusToAdmin(rawStatus);

  const refNumber =
    data.refNumber ||
    data.bookingRef ||
    data.bookingId ||
    data.referenceNumber ||
    `BK-${id.slice(-6).toUpperCase()}`;

  const customerName =
    data.customerName ||
    data.userName ||
    data.citizenName ||
    data.clientName ||
    'Resident Citizen';

  const customerPhone =
    data.customerPhone ||
    data.userPhone ||
    data.phone ||
    data.contactNumber ||
    '+91 98765 00000';

  const workerId =
    data.workerId ||
    data.artisanId ||
    data.providerId ||
    (status === 'assigned' || status === 'active' || status === 'completed' ? 'DL-ART-001' : 'Unassigned');

  const workerName =
    data.workerName ||
    data.artisanName ||
    data.providerName ||
    (data.workerId ? `Artisan (${String(data.workerId).slice(-6)})` : 'Cooperative Artisan');

  const trade =
    data.trade ||
    data.tradeCategory ||
    data.serviceCategory ||
    data.category ||
    'General Maintenance';

  const zone =
    data.zone ||
    data.sector ||
    data.sectorZone ||
    data.location ||
    data.area ||
    'Central Delhi';

  const address =
    data.address ||
    data.serviceAddress ||
    data.locationAddress ||
    'Delhi NCT';

  const category =
    data.category ||
    data.serviceName ||
    data.serviceTitle ||
    data.service ||
    trade;

  const escrowAmount = Number(
    data.escrowAmount ??
    data.amount ??
    data.price ??
    data.totalAmount ??
    data.fee ??
    1200
  );

  const coopFee = Number(
    data.coopFee ??
    data.platformFee ??
    Math.round(escrowAmount * 0.05)
  );

  const scheduledTime = formatTimeField(
    data.scheduledTime ||
    data.scheduledAt ||
    data.timeSlot ||
    data.createdAt
  );

  const elapsedTime = data.elapsedTime || undefined;

  let startedAt: string | undefined = undefined;
  if (data.startedAt) {
    startedAt = formatTimeField(data.startedAt);
  }

  const otpVerified = Boolean(
    data.otpVerified ??
    data.isOtpVerified ??
    (rawStatus === 'in_progress' || rawStatus === 'completed')
  );

  return {
    id,
    refNumber,
    customerName,
    customerPhone,
    workerId,
    workerName,
    trade,
    zone,
    address,
    category,
    status,
    escrowAmount,
    scheduledTime,
    elapsedTime,
    startedAt,
    otpVerified,
    coopFee,
  };
}

/**
 * Live-subscribes (onSnapshot) to the ENTIRE "bookings" collection, no filter.
 * Admin needs visibility into every booking across all workers.
 */
export function subscribeToBookings(
  onUpdate: (bookings: BookingRecord[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const collectionPath = 'bookings';
  const bookingsCol = collection(db, collectionPath);

  const unsubscribe = onSnapshot(
    bookingsCol,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const records: BookingRecord[] = snapshot.docs.map((docSnap) =>
        mapDocToBookingRecord(docSnap)
      );
      onUpdate(records);
    },
    (error) => {
      console.error('Error in bookings onSnapshot subscription:', error);
      if (onError) {
        onError(error);
      }
      try {
        handleFirestoreError(error, FirestoreOperationType.LIST, collectionPath);
      } catch (e) {
        // Logged
      }
    }
  );

  return unsubscribe;
}

/**
 * Writes updated booking status back to Firestore using reverse mapping.
 */
export async function updateBookingStatus(
  bookingId: string,
  newAdminStatus: BookingRecord['status']
): Promise<void> {
  const firestoreStatus = mapAdminStatusToFirestore(newAdminStatus);
  const docPath = `bookings/${bookingId}`;
  const bookingRef = doc(db, 'bookings', bookingId);

  try {
    await updateDoc(bookingRef, {
      status: firestoreStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Failed to update booking ${bookingId} in Firestore:`, error);
    handleFirestoreError(error, FirestoreOperationType.UPDATE, docPath);
  }
}
