import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { DisputeRecord, DisputeMessage } from '../types';
import { INITIAL_DISPUTES } from '../data/initialData';

/**
 * Maps a Firestore document from "disputes" collection to DisputeRecord
 */
export function mapFirestoreDocToDisputeRecord(id: string, data: DocumentData): DisputeRecord {
  const refNumber = data.refNumber || `DISP-${id.slice(0, 6).toUpperCase()}`;
  const bookingRef = data.bookingRef || data.bookingId || 'BK-UNKNOWN';
  const lodgedBy = data.lodgedBy === 'worker' ? 'worker' : 'customer';
  const complainantName = data.complainantName || data.customerName || 'Complainant';
  const respondentName = data.respondentName || data.workerName || 'Respondent';
  const trade = data.trade || 'General Service';
  const category = data.category || 'service_quality';
  const summary = data.summary || data.issue || data.reason || 'Grievance lodged';
  const escrowAmount =
    typeof data.escrowAmount === 'number'
      ? data.escrowAmount
      : typeof data.amount === 'number'
      ? data.amount
      : 1000;
  const severity =
    data.severity === 'high' || data.severity === 'medium' || data.severity === 'low'
      ? data.severity
      : 'medium';

  let lodgedDate = data.lodgedDate;
  if (!lodgedDate && data.createdAt) {
    if (typeof data.createdAt.toDate === 'function') {
      lodgedDate =
        data.createdAt.toDate().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' IST';
    } else if (typeof data.createdAt === 'string') {
      lodgedDate = data.createdAt;
    }
  }
  if (!lodgedDate) {
    lodgedDate = 'Recent';
  }

  const rawStatus = String(data.status || 'open').toLowerCase().trim();
  let status: DisputeRecord['status'] = 'open';
  if (rawStatus === 'resolved' || rawStatus === 'closed') {
    status = 'resolved';
  } else if (
    rawStatus === 'under_mediation' ||
    rawStatus === 'in_mediation' ||
    rawStatus === 'mediation'
  ) {
    status = 'under_mediation';
  } else {
    status = 'open';
  }

  // Thread messages
  let messages: DisputeMessage[] = [];
  if (Array.isArray(data.messages) && data.messages.length > 0) {
    messages = data.messages.map((m: any, idx: number) => ({
      id: m.id || `msg-${idx}`,
      senderRole:
        m.senderRole === 'worker' ? 'worker' : m.senderRole === 'admin' ? 'admin' : 'customer',
      senderName:
        m.senderName ||
        (m.senderRole === 'worker'
          ? respondentName
          : m.senderRole === 'admin'
          ? 'Co-op Registrar'
          : complainantName),
      message: m.message || m.text || '',
      timestamp: m.timestamp || lodgedDate,
    }));
  } else {
    // Fallback if messages thread is empty
    const constructed: DisputeMessage[] = [];
    if (data.customerStatement || summary) {
      constructed.push({
        id: 'msg-cust-1',
        senderRole: 'customer',
        senderName: complainantName,
        message: data.customerStatement || summary,
        timestamp: lodgedDate,
      });
    }
    if (data.workerStatement) {
      constructed.push({
        id: 'msg-work-1',
        senderRole: 'worker',
        senderName: respondentName,
        message: data.workerStatement,
        timestamp: lodgedDate,
      });
    }
    messages =
      constructed.length > 0
        ? constructed
        : [
            {
              id: 'msg-1',
              senderRole: lodgedBy,
              senderName: complainantName,
              message: summary,
              timestamp: lodgedDate,
            },
          ];
  }

  return {
    id,
    refNumber,
    bookingRef,
    lodgedBy,
    complainantName,
    respondentName,
    trade,
    category,
    summary,
    escrowAmount,
    severity,
    lodgedDate,
    status,
    resolutionDecision: data.resolutionDecision,
    resolvedAt: data.resolvedAt,
    resolvedBy: data.resolvedBy,
    messages,
    bookingId: data.bookingId,
    workerId: data.workerId,
    customerId: data.customerId || data.customerPhone,
    customerPhone: data.customerPhone,
    hasWorkerUnreadUpdate: Boolean(data.hasWorkerUnreadUpdate),
    hasCustomerUnreadUpdate: Boolean(data.hasCustomerUnreadUpdate),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    customerStatement: data.customerStatement,
    workerStatement: data.workerStatement,
    evidenceNotes: data.evidenceNotes,
  };
}

let isSeeding = false;
async function seedInitialDisputes() {
  if (isSeeding) return;
  isSeeding = true;
  try {
    for (const dispute of INITIAL_DISPUTES) {
      await setDoc(
        doc(db, 'disputes', dispute.id),
        {
          ...dispute,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.error('Failed to seed initial disputes to Firestore:', err);
  } finally {
    isSeeding = false;
  }
}

/**
 * Live-subscribes (onSnapshot) to the shared "disputes" collection in Firestore.
 */
export function subscribeToDisputes(
  onUpdate: (disputes: DisputeRecord[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const disputesCol = collection(db, 'disputes');

  const unsubscribe = onSnapshot(
    disputesCol,
    (snapshot: QuerySnapshot<DocumentData>) => {
      if (snapshot.empty) {
        // Seed initial demo disputes if collection is completely empty
        seedInitialDisputes();
        onUpdate(INITIAL_DISPUTES);
        return;
      }

      const records: DisputeRecord[] = snapshot.docs.map((docSnap) =>
        mapFirestoreDocToDisputeRecord(docSnap.id, docSnap.data())
      );

      // Sort open first, then by ref
      records.sort((a, b) => {
        if (a.status === 'open' && b.status !== 'open') return -1;
        if (a.status !== 'open' && b.status === 'open') return 1;
        return a.refNumber.localeCompare(b.refNumber);
      });

      onUpdate(records);
    },
    (error) => {
      console.error('Error in disputes onSnapshot subscription:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Resolves a dispute document in Firestore
 */
export async function resolveDisputeInFirestore(
  disputeId: string,
  decision: string,
  notes: string,
  officerName: string,
  existingMessages: DisputeMessage[]
): Promise<void> {
  const disputeRef = doc(db, 'disputes', disputeId);

  const timestampStr =
    new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' IST';

  const finalNotes = notes ? ` · Notes: ${notes}` : '';
  const adminMessage: DisputeMessage = {
    id: `msg-admin-${Date.now()}`,
    senderRole: 'admin',
    senderName: officerName || 'Co-op Registrar Officer',
    message: `Statutory Determination: ${decision}${finalNotes}`,
    timestamp: timestampStr,
  };

  const updatedMessages = [...existingMessages, adminMessage];

  await setDoc(
    disputeRef,
    {
      status: 'resolved',
      resolutionDecision: decision,
      resolutionNotes: notes || '',
      resolvedAt: new Date().toISOString(),
      resolvedBy: officerName || 'Co-op Registrar Officer',
      messages: updatedMessages,
      hasWorkerUnreadUpdate: true,
      hasCustomerUnreadUpdate: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
