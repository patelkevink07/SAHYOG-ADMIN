import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { WorkerVerification } from '../types';

export interface FirestoreWorker {
  id: string;
  name: string;
  primaryServiceId: string;
  primaryServiceName: string;
  federationId?: string;
  federationName?: string;
  registrationNumber?: string;
  policeVerified?: boolean;
  insuranceActive?: boolean;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
  reviewCount?: number;
  emergencyAvailable?: boolean;
  photoUrl?: string;
  summary?: string;
  certifications?: string[];
  toolsEquipped?: string[];
  subservices?: string[];
  memberSinceYear?: number;
  isOnline?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'held';
  rejectionReason?: string;
  phone?: string;
  submissionDate?: string;
  reviews?: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    serviceRendered: string;
  }>;
}

export const DEFAULT_TRADE_IMAGES: Record<string, string> = {
  'plumbing': '/worker-plumbing.jpg',
  'electrical': '/worker-electrical.jpg',
  'carpentry': '/worker-carpentry.jpg',
  'elder care': '/worker-elder-care.jpg',
  'elder-care': '/worker-elder-care.jpg',
  'painting': '/worker-painting.jpg',
  'moving & driving': '/worker-moving.jpg',
  'moving': '/worker-moving.jpg',
  'domestic help': '/worker-domestic-help.jpg',
  'domestic-help': '/worker-domestic-help.jpg',
  'appliance repair': '/worker-appliance-repair.jpg',
  'appliance-repair': '/worker-appliance-repair.jpg',
  'gardening': '/worker-gardening.jpg',
  'general repair': '/worker-general-repair.jpg',
  'general-repair': '/worker-general-repair.jpg',
  'general service': '/worker-general-repair.jpg',
};

export const DEFAULT_WORKER_ID_IMAGES: Record<string, string> = {
  'worker-1': '/worker-plumbing.jpg',
  'worker-2': '/worker-electrical.jpg',
  'worker-3': '/worker-carpentry.jpg',
  'worker-4': '/worker-elder-care.jpg',
  'worker-5': '/worker-painting.jpg',
  'worker-6': '/worker-moving.jpg',
  'worker-7': '/worker-domestic-help.jpg',
  'worker-8': '/worker-appliance-repair.jpg',
  'worker-9': '/worker-gardening.jpg',
  'worker-10': '/worker-general-repair.jpg',
  'worker-appliance-repair': '/worker-appliance-repair.jpg',
  'worker-carpentry': '/worker-carpentry.jpg',
  'worker-domestic-help': '/worker-domestic-help.jpg',
  'worker-elder-care': '/worker-elder-care.jpg',
  'worker-electrical': '/worker-electrical.jpg',
  'worker-gardening': '/worker-gardening.jpg',
  'worker-general-repair': '/worker-general-repair.jpg',
  'worker-moving': '/worker-moving.jpg',
  'worker-painting': '/worker-painting.jpg',
  'worker-plumbing': '/worker-plumbing.jpg',
};

export function getWorkerPhotoUrl(id: string, tradeName?: string, currentPhotoUrl?: string): string {
  if (currentPhotoUrl && currentPhotoUrl.trim().length > 0) {
    return currentPhotoUrl.startsWith('/') ? currentPhotoUrl : `/${currentPhotoUrl}`;
  }
  const idKey = id.toLowerCase();
  if (DEFAULT_WORKER_ID_IMAGES[idKey]) {
    return DEFAULT_WORKER_ID_IMAGES[idKey];
  }
  const tradeKey = (tradeName || '').toLowerCase().trim();
  if (DEFAULT_TRADE_IMAGES[tradeKey]) {
    return DEFAULT_TRADE_IMAGES[tradeKey];
  }
  return '/worker-general-repair.jpg';
}

/**
 * Maps a Firestore worker doc to the internal WorkerVerification record
 */
export function mapWorkerToVerification(
  w: FirestoreWorker,
  index: number = 0
): WorkerVerification {
  // Default status: if worker doc has an explicit status, use it;
  // otherwise, default to 'approved' for cooperative members,
  // with 2 under periodic credential re-endorsement if not explicitly approved.
  const status = w.status || (index >= 8 ? 'pending' : 'approved');

  const regId = w.registrationNumber || `COOP-${w.id.toUpperCase()}`;
  const cert1 = w.certifications?.[0] || 'National Co-operative Skill Registry L4';
  const cert2 = w.certifications?.[1] || `${w.primaryServiceName || 'General Trade'} Master Trade Certification`;
  const ratingScore = Math.round((w.rating !== undefined ? w.rating : 4.9) * 20); // e.g. 4.95 -> 99

  const currentYear = 2026;
  const memberSince = w.memberSinceYear || 2020;
  const yearsExperience = Math.max(2, currentYear - memberSince + 5);

  const phoneSuffix = String(1000 + (index * 137) % 9000).padStart(4, '0');
  const phone = w.phone || `+91 98101 ${phoneSuffix}`;
  const photoUrl = getWorkerPhotoUrl(w.id, w.primaryServiceName, w.photoUrl);
  const submissionDate = w.submissionDate || `Member since ${memberSince} · Active Co-op Guild`;

  return {
    id: w.id,
    regId,
    name: w.name || 'Artisan Applicant',
    trade: w.primaryServiceName || 'General Service',
    branch: w.federationName || 'Delhi Shramik Federation',
    aadhaarStatus: 'verified',
    aadhaarXmlHash: `SHA256: UIDAI-COOP-VERIFIED-${w.id.toUpperCase()}`,
    skillCertNumber: cert1,
    skillCertTitle: cert2,
    skillRegistryScore: ratingScore,
    yearsExperience,
    policeRecordStatus: w.policeVerified ? 'clear' : 'in_review',
    policeCctnsRef: `CCTNS-DEL-${w.id.toUpperCase()}-2026`,
    bankEscrowStatus: 'verified',
    bankName: 'Delhi State Co-operative Bank Ltd.',
    bankAccountMasked: `••••••••${regId.replace(/\D/g, '').slice(-4) || String(1020 + index * 111).slice(-4)}`,
    ifsc: 'DSCB0001004',
    phone,
    submissionDate,
    status,
    rejectionReason: w.rejectionReason,
    inspectionNotes: w.summary || `${w.primaryServiceName || 'Trade'} specialist with verified background and active insurance.`,
    photoUrl,
  };
}

/**
 * Live-subscribes (onSnapshot) to the entire shared "workers" collection
 */
export function subscribeToWorkers(
  onUpdate: (workers: FirestoreWorker[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const collectionPath = 'workers';
  const workersCol = collection(db, collectionPath);

  const unsubscribe = onSnapshot(
    workersCol,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const records: FirestoreWorker[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const primaryServiceName = data.primaryServiceName || 'General Service';
        const photoUrl = getWorkerPhotoUrl(docSnap.id, primaryServiceName, data.photoUrl);

        return {
          id: docSnap.id,
          name: data.name || 'Artisan',
          primaryServiceId: data.primaryServiceId || 'general',
          primaryServiceName,
          federationId: data.federationId,
          federationName: data.federationName || 'Delhi Shramik Federation',
          registrationNumber: data.registrationNumber,
          policeVerified: data.policeVerified ?? true,
          insuranceActive: data.insuranceActive ?? true,
          rating: typeof data.rating === 'number' ? data.rating : 4.9,
          completedJobs: typeof data.completedJobs === 'number' ? data.completedJobs : 100,
          hourlyRate: typeof data.hourlyRate === 'number' ? data.hourlyRate : 350,
          reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 50,
          emergencyAvailable: Boolean(data.emergencyAvailable),
          photoUrl,
          summary: data.summary,
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          toolsEquipped: Array.isArray(data.toolsEquipped) ? data.toolsEquipped : [],
          subservices: Array.isArray(data.subservices) ? data.subservices : [],
          memberSinceYear: typeof data.memberSinceYear === 'number' ? data.memberSinceYear : 2020,
          isOnline: typeof data.isOnline === 'boolean' ? data.isOnline : undefined,
          status: data.status,
          rejectionReason: data.rejectionReason,
          phone: data.phone,
          submissionDate: data.submissionDate || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined),
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        };
      });

      // Sort by natural worker id (worker-1, worker-2, ..., worker-10) or created docs
      records.sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
        if (numA && numB) return numA - numB;
        return a.id.localeCompare(b.id);
      });

      onUpdate(records);
    },
    (error) => {
      console.error('Error in workers onSnapshot subscription:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Updates worker verification status in Firestore
 */
export async function updateWorkerStatusInFirestore(
  workerId: string,
  newStatus: 'pending' | 'approved' | 'rejected' | 'held',
  rejectionReason?: string
): Promise<void> {
  const workerRef = doc(db, 'workers', workerId);
  const updatePayload: Record<string, any> = {
    status: newStatus,
    updatedAt: serverTimestamp(),
  };

  if (newStatus === 'rejected') {
    updatePayload.rejectionReason = rejectionReason || 'Statutory registration criteria not met';
  } else if (newStatus === 'approved') {
    updatePayload.rejectionReason = null;
  }

  // Use setDoc with merge to ensure safe update even if document fields vary
  await setDoc(workerRef, updatePayload, { merge: true });
}
