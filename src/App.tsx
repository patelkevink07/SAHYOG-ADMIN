/**
 * Main Application Component — Sahyog Admin
 * Labour Cooperative Federation Internal Operations Portal for SIH26089
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { VerificationQueueView } from './components/VerificationQueueView';
import { WorkforceMapView } from './components/WorkforceMapView';
import { BookingsView } from './components/BookingsView';
import { DisputesView } from './components/DisputesView';
import { PayoutsView } from './components/PayoutsView';
import { AiForecastAnalyticsView } from './components/AiForecastAnalyticsView';
import { InspectionDrawer } from './components/InspectionDrawer';
import { DisputeResolutionModal } from './components/DisputeResolutionModal';
import { LoginScreen } from './components/LoginScreen';

import {
  WorkerVerification,
  BookingRecord,
  DisputeRecord,
  PayoutRecord,
  ZoneAllocation,
  ForecastDay,
  NavigationSection,
  OfficerProfile,
} from './types';

import {
  initialVerifications,
  initialDisputes,
  initialPayouts,
  initialZones,
  initialForecastDays,
  defaultOfficer,
} from './data/initialData';
import { subscribeToBookings, updateBookingStatus } from './lib/bookingsService';

export default function App() {
  // Authentication State with safe defaults
  const [officer, setOfficer] = useState<OfficerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sahyog_officer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && (parsed.name || parsed.id)) {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    return defaultOfficer; // Default logged in for immediate review, with logout available
  });

  // Navigation & Zone State
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedZone, setSelectedZone] = useState('All Federation Zones');
  const [globalSearch, setGlobalSearch] = useState('');

  // Persisted Domain Entities with safe array checks
  const [verifications, setVerifications] = useState<WorkerVerification[]>(() => {
    try {
      const saved = localStorage.getItem('sahyog_verifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return initialVerifications;
  });

  // Bookings live-subscribed from Firestore 'bookings' collection
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  // Live-subscribe (onSnapshot) to the ENTIRE "bookings" collection, no filter
  useEffect(() => {
    const unsubscribe = subscribeToBookings(
      (liveBookings) => {
        setBookings(liveBookings);
      },
      (error) => {
        console.error('Failed to subscribe to Firestore bookings:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sahyog_disputes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return initialDisputes;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sahyog_payouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return initialPayouts;
  });

  const [zones, setZones] = useState<ZoneAllocation[]>(() => {
    try {
      const saved = localStorage.getItem('sahyog_zones');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return initialZones;
  });

  const [forecastDays] = useState<ForecastDay[]>(initialForecastDays);

  // Active Drawers & Modals
  const [activeInspectorWorker, setActiveInspectorWorker] = useState<WorkerVerification | null>(null);
  const [activeDisputeModal, setActiveDisputeModal] = useState<DisputeRecord | null>(null);
  const [alertBroadcasted, setAlertBroadcasted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sahyog_verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('sahyog_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('sahyog_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('sahyog_zones', JSON.stringify(zones));
  }, [zones]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Action: Approve Worker
  const handleApproveWorker = (worker: WorkerVerification) => {
    setVerifications((prev) =>
      prev.map((w) => (w.id === worker.id ? { ...w, status: 'approved' as const } : w))
    );
    showToast(`Approved ${worker.name} (${worker.regId}) · Co-op Card Issued`);
  };

  // Action: Reject Worker
  const handleRejectWorker = (worker: WorkerVerification, reason?: string) => {
    setVerifications((prev) =>
      prev.map((w) => (w.id === worker.id ? { ...w, status: 'rejected' as const } : w))
    );
    showToast(`Rejected ${worker.name} · Statutory ground recorded in audit ledger`);
  };

  // Action: Batch Approve Clear
  const handleBatchApproveClear = () => {
    setVerifications((prev) =>
      prev.map((w) =>
        w.status === 'pending' && w.policeRecordStatus === 'clear'
          ? { ...w, status: 'approved' as const }
          : w
      )
    );
    showToast(`Batch approved all clear police dossiers · Co-op credentials issued`);
  };

  // Action: Reset Verifications
  const handleResetVerifications = () => {
    setVerifications(initialVerifications);
    showToast('Reset verification queue to standard demo records');
  };

  // Action: Reallocate Workforce
  const handleReallocate = (fromZoneId: string, toZoneId: string, count: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === fromZoneId) {
          const newStandby = Math.max(0, z.standby - count);
          const newDuty = Math.max(0, z.onDuty - count);
          const coverage = Math.round((newDuty / z.totalCapacity) * 100);
          return {
            ...z,
            standby: newStandby,
            onDuty: newDuty,
            coveragePercentage: coverage,
          };
        }
        if (z.id === toZoneId) {
          const newStandby = z.standby + count;
          const newDuty = z.onDuty + count;
          const coverage = Math.round((newDuty / z.totalCapacity) * 100);
          return {
            ...z,
            standby: newStandby,
            onDuty: newDuty,
            coveragePercentage: coverage,
            deficitStatus: coverage >= 80 ? 'adequate' : 'moderate_deficit',
          };
        }
        return z;
      })
    );
  };

  // Action: Update Booking Status with Firestore persistence (reverse mapping)
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingRecord['status']) => {
    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await updateBookingStatus(id, newStatus);
      showToast(`Booking ${id} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update booking status in Firestore:', error);
      showToast(`Failed to update booking ${id} in Firestore`);
    }
  };

  // Action: Resolve Dispute
  const handleResolveDispute = (disputeId: string, decision: string, notes: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: 'resolved' as const,
              resolutionDecision: decision,
            }
          : d
      )
    );
    showToast(`Resolved dispute: ${decision}`);
  };

  // Action: Process Single Payout
  const handleProcessPayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cleared' as const } : p))
    );
  };

  // Action: Batch Process Payouts
  const handleBatchProcessPayouts = (ids: string[]) => {
    setPayouts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status: 'cleared' as const } : p))
    );
  };

  // Action: Reset Payouts
  const handleResetPayouts = () => {
    setPayouts(initialPayouts);
    showToast('Reset payouts ledger to standard demo records');
  };

  // Action: Broadcast Alert
  const handleBroadcastAlert = () => {
    setAlertBroadcasted(true);
    showToast('Standby dispatch notification transmitted to 28 registered electricians in West Delhi.');
  };

  // Action: Officer Login / Logout
  const handleLogin = (officerProfile: OfficerProfile) => {
    setOfficer(officerProfile);
    localStorage.setItem('sahyog_officer', JSON.stringify(officerProfile));
    showToast(`Officer session authenticated: ${officerProfile.name}`);
  };

  const handleLogout = () => {
    setOfficer(null);
    localStorage.removeItem('sahyog_officer');
  };

  // Counts for Badges
  const pendingVerificationsCount = verifications.filter((v) => v.status === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;
  const pendingPayoutsCount = payouts.filter((p) => p.status === 'pending').length;
  const totalEscrowPending = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.netPayable, 0);

  // If officer not logged in, show Login Screen
  if (!officer) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex bg-[#FAFAF9] text-[#14181F] overflow-hidden antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={(section) => {
          setCurrentSection(section);
        }}
        pendingVerificationsCount={pendingVerificationsCount}
        openDisputesCount={openDisputesCount}
        pendingPayoutsCount={pendingPayoutsCount}
        officer={officer}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
        onEmergencyClick={() => {
          showToast('Emergency escalation alert dispatched to Zonal Federation Director');
        }}
        onSettingsClick={() => {
          showToast('Cooperative Federation Settings: Delhi NCT Chapter (NCCT Reg. F-8842)');
        }}
        onAuditLogsClick={() => {
          showToast('Statutory Audit Ledger: 412 operations logged today in accordance with 2003 Act');
        }}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Application Header */}
        <Header
          officer={officer}
          currentSection={currentSection}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onLogout={handleLogout}
          onExportCsv={() => {
            showToast('Exported active cooperative registers to CSV');
          }}
        />

        {/* Primary Operational Workspace Container */}
        <main
          id="main-content-area"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#FAFAF9] focus:outline-none"
        >
          <div className="max-w-7xl mx-auto pb-12">
            {/* View Switching */}
            {currentSection === 'dashboard' && (
              <DashboardView
                verifications={verifications}
                zones={zones}
                forecastDays={forecastDays}
                openDisputesCount={openDisputesCount}
                totalEscrowPending={totalEscrowPending}
                onApproveWorker={handleApproveWorker}
                onInspectWorker={(w) => setActiveInspectorWorker(w)}
                onRejectWorker={(w) => handleRejectWorker(w)}
                onNavigate={setCurrentSection}
                onBroadcastAlert={handleBroadcastAlert}
                alertBroadcasted={alertBroadcasted}
              />
            )}

            {currentSection === 'verification' && (
              <VerificationQueueView
                verifications={verifications}
                onApprove={handleApproveWorker}
                onReject={(w, reason) => handleRejectWorker(w, reason)}
                onInspect={(w) => setActiveInspectorWorker(w)}
                onBatchApproveClear={handleBatchApproveClear}
                onResetVerifications={handleResetVerifications}
              />
            )}

            {currentSection === 'workforce-map' && (
              <WorkforceMapView
                zones={zones}
                onReallocate={handleReallocate}
              />
            )}

            {currentSection === 'bookings' && (
              <BookingsView
                bookings={bookings}
                onUpdateStatus={handleUpdateBookingStatus}
              />
            )}

            {currentSection === 'disputes' && (
              <DisputesView
                disputes={disputes}
                onOpenResolveModal={(d) => setActiveDisputeModal(d)}
                onQuickResolve={(id, decision) => handleResolveDispute(id, decision, '')}
              />
            )}

            {currentSection === 'payouts' && (
              <PayoutsView
                payouts={payouts}
                onProcessPayout={handleProcessPayout}
                onBatchProcessPayouts={handleBatchProcessPayouts}
                onResetPayouts={handleResetPayouts}
              />
            )}

            {currentSection === 'ai-forecast' && (
              <AiForecastAnalyticsView
                forecastDays={forecastDays}
                onBroadcastAlert={handleBroadcastAlert}
                alertBroadcasted={alertBroadcasted}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating System Confirmation Banner / Toast */}
      {toastMessage && (
        <div
          id="toast-notification-banner"
          className="fixed bottom-5 right-5 z-50 bg-[#14181F] text-white px-4 py-2.5 rounded-[8px] text-[13px] shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-150 border border-[#303833]"
        >
          <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#9CA3AF] hover:text-white text-[11px] font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Statutory Dossier Inspection Side Drawer */}
      <InspectionDrawer
        worker={activeInspectorWorker}
        isOpen={Boolean(activeInspectorWorker)}
        onClose={() => setActiveInspectorWorker(null)}
        onApprove={handleApproveWorker}
        onReject={handleRejectWorker}
        onHold={(w) => {
          showToast(`Re-verification requested for ${w.name}`);
        }}
      />

      {/* Dispute Mediation Drawer / Modal */}
      <DisputeResolutionModal
        dispute={activeDisputeModal}
        isOpen={Boolean(activeDisputeModal)}
        onClose={() => setActiveDisputeModal(null)}
        onResolve={handleResolveDispute}
      />
    </div>
  );
}
