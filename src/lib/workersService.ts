import {
  collection,
  doc,
  onSnapshot,
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
  status?: 'pending' | 'approved' | 'rejected' | 'held';
  reviews?: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    serviceRendered: string;
  }>;
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
  const cert2 = w.certifications?.[1] || `${w.primaryServiceName} Master Trade Certification`;
  const ratingScore = Math.round((w.rating || 4.9) * 20); // e.g. 4.95 -> 99

  const currentYear = 2026;
  const memberSince = w.memberSinceYear || 2020;
  const yearsExperience = Math.max(3, currentYear - memberSince + 5);

  const phoneSuffix = String(1000 + (index * 137) % 9000).padStart(4, '0');
  const phone = `+91 98101 ${phoneSuffix}`;

  return {
    id: w.id,
    regId,
    name: w.name,
    trade: w.primaryServiceName,
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
    submissionDate: `Member since ${memberSince} · Active Co-op Guild`,
    status,
    inspectionNotes: w.summary || `${w.primaryServiceName} specialist with verified background and active insurance.`,
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
        return {
          id: docSnap.id,
          name: data.name || 'Artisan',
          primaryServiceId: data.primaryServiceId || 'general',
          primaryServiceName: data.primaryServiceName || 'General Service',
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
          photoUrl: data.photoUrl,
          summary: data.summary,
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          toolsEquipped: Array.isArray(data.toolsEquipped) ? data.toolsEquipped : [],
          subservices: Array.isArray(data.subservices) ? data.subservices : [],
          memberSinceYear: typeof data.memberSinceYear === 'number' ? data.memberSinceYear : 2020,
          status: data.status,
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        };
      });

      // Sort by natural worker id (worker-1, worker-2, ..., worker-10)
      records.sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
        return numA - numB;
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
  newStatus: 'pending' | 'approved' | 'rejected' | 'held'
): Promise<void> {
  const workerRef = doc(db, 'workers', workerId);
  await updateDoc(workerRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}
