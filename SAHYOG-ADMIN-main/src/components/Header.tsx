/**
 * Header Component — Sahyog Admin
 * Desktop-first dock header with global search, district selector, dispatch status, notifications & export.
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  Bell,
  HelpCircle,
  Download,
  Menu,
  X,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { OfficerUser, NavigationSection } from '../types';

export interface HeaderProps {
  currentOfficer?: OfficerUser | null;
  officer?: OfficerUser | null;
  currentSection?: NavigationSection;
  selectedZone: string;
  onZoneChange?: (zone: string) => void;
  onSelectZone?: (zone: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onExportCsv?: () => void;
  toggleSidebar?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onOpenHelp?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOfficer,
  officer,
  currentSection,
  selectedZone,
  onZoneChange,
  onSelectZone,
  searchQuery = '',
  onSearchChange = (_q: string) => {},
  onExportCsv,
  toggleSidebar,
  onToggleSidebar,
  isSidebarCollapsed = false,
  onOpenHelp,
  onLogout,
}) => {
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleToggleSidebar = onToggleSidebar || toggleSidebar || (() => {});
  const handleZoneChange = onSelectZone || onZoneChange || (() => {});

  const handleExport = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
    // Default immediate CSV download
    const csvHeader = 'Record_Type,ID,Name_or_Reference,Trade_Category,Sector_Branch,Status,Amount_INR\n';
    const csvRows = [
      'Worker_Verification,DL-PLM-889,Ramesh Chand Verma,Plumbing,North-West Hub (Rohini),Pending,-',
      'Worker_Verification,DL-AID-402,Anita Soren,Geriatric Aid & Care,Central Zone (Karol Bagh),Pending,-',
      'Worker_Verification,DL-ELE-302,Mukesh Pal,Electrical & Wiring,Central Zone (Connaught),Pending,-',
      'Booking,BK-2025-8841,Sunita Rao,HVAC & Refrigeration,Dwarka West Sector 12,In Progress,1450',
      'Dispute,DISP-401,Dr. Vivek Saxena vs Mukesh Pal,Electrical & Wiring,Central Delhi,Open,1150',
      'Escrow_Payout,PAY-0891,Mukesh Pal,Electrical & Wiring,Central Delhi,Pending,3240',
    ].join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahyog_federation_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const zones = [
    'North Delhi & Central Zone',
    'South & South-East Zone (Okhla / Kalkaji)',
    'West & Dwarka Sector Grid',
    'East Zone (Trans-Yamuna)',
    'All Federation Sectors',
  ];

  const notifications = [
    {
      id: 'n1',
      title: 'Heatwave Advisory Issued (IMD)',
      time: '12 mins ago',
      desc: 'Peak temperatures forecasted. +34% electrical/AC workload surge anticipated.',
      unread: true,
    },
    {
      id: 'n2',
      title: 'New Dispute Escalated',
      time: '45 mins ago',
      desc: 'Dispute DISP-402 escalated to Branch Officer for escrow mediation.',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Kiosk Terminal K-04 Online',
      time: '1 hr ago',
      desc: 'Rohini Depot Kiosk biometric gateway re-synchronized successfully.',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-[#FAFAF9] border-b border-[#E7E5E1] sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={handleToggleSidebar}
          className="p-1.5 text-[#6B7280] hover:text-[#14181F] hover:bg-white rounded-[8px] border border-transparent hover:border-[#E7E5E1] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B7280] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search worker ID, booking reference, or grievance..."
            className="w-full bg-white pl-9 pr-12 py-1.5 text-[13px] text-[#14181F] placeholder-[#6B7280] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:border-[#1F4D3D] focus:ring-1 focus:ring-[#1F4D3D] transition"
          />
          <span className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] bg-[#F1F1EF] border border-[#E7E5E1] rounded select-none pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls: District Selector, Live Status, Bell, Help, Export */}
      <div className="flex items-center gap-3">
        {/* District Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
            className="flex items-center gap-2 bg-white border border-[#E7E5E1] rounded-[8px] px-3 py-1.5 text-[13px] font-medium text-[#14181F] hover:bg-[#F5F5F4] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition"
          >
            <MapPin className="w-4 h-4 text-[#1F4D3D]" />
            <span className="truncate max-w-[180px]">{selectedZone}</span>
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>

          {zoneDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-[#E7E5E1] rounded-[10px] shadow-lg py-1 z-30">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-[#6B7280] tracking-wider border-b border-[#E7E5E1]">
                Operational Sectors
              </div>
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    handleZoneChange(z);
                    setZoneDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between hover:bg-[#F5F5F4] transition-colors ${
                    selectedZone === z
                      ? 'font-semibold text-[#1F4D3D] bg-[#F1F3FE]'
                      : 'text-[#14181F]'
                  }`}
                >
                  <span className="truncate">{z}</span>
                  {selectedZone === z && (
                    <CheckCircle className="w-3.5 h-3.5 text-[#1F4D3D]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Dispatch Grid Pulse */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-white border border-[#E7E5E1] rounded-[8px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F4D3D]"></span>
          </span>
          <span className="text-[11px] font-semibold text-[#14181F] tracking-tight">
            Dispatch Grid Live
          </span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-[#6B7280] hover:text-[#14181F] hover:bg-white rounded-[8px] border border-transparent hover:border-[#E7E5E1] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#B91C1C] rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-white border border-[#E7E5E1] rounded-[10px] shadow-xl py-2 z-30 text-[12px]">
              <div className="px-3 pb-2 border-b border-[#E7E5E1] flex items-center justify-between">
                <span className="font-semibold text-[#14181F]">Operational Notices</span>
                <span className="text-[10px] text-[#6B7280] font-mono">2 UNREAD</span>
              </div>
              <div className="divide-y divide-[#E7E5E1] max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 hover:bg-[#FAFAF9] transition-colors ${
                      n.unread ? 'bg-[#FAFAF9]/80' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#14181F]">{n.title}</span>
                      <span className="text-[10px] text-[#6B7280]">{n.time}</span>
                    </div>
                    <p className="text-[#6B7280] text-[11px] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={() => {
            if (onOpenHelp) onOpenHelp();
            else setHelpModalOpen(true);
          }}
          className="p-2 text-[#6B7280] hover:text-[#14181F] hover:bg-white rounded-[8px] border border-transparent hover:border-[#E7E5E1] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition"
          title="Statutory Guidelines & Shortcuts"
          aria-label="Statutory Guidelines"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Rapid Export CSV */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] rounded-[8px] text-[13px] font-medium text-[#14181F] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition cursor-pointer"
          title="Export active records to CSV"
        >
          <Download className="w-4 h-4 text-[#6B7280]" />
          <span className="hidden md:inline">Export CSV</span>
        </button>
      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] border border-[#E7E5E1] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E1] pb-3">
              <div className="flex items-center gap-2 text-[#1F4D3D]">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-[16px] text-[#14181F]">Statutory Operations Guide</h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-[#6B7280] hover:text-[#14181F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[13px] text-[#414944] space-y-3 leading-relaxed">
              <p>
                <strong className="text-[#14181F]">Delhi Co-operative Societies Act 2003:</strong>
                <br />
                All artisans must hold a valid DigiLocker biometric Aadhaar XML hash and minimum Level 2 trade guild certification prior to field dispatch.
              </p>
              <p>
                <strong className="text-[#14181F]">Escrow Settlement Rule:</strong>
                <br />
                Customer payments remain locked in the cooperative welfare escrow until service OTP verification. Payouts clear direct to artisan accounts on a T+1 settlement cycle.
              </p>
              <p>
                <strong className="text-[#14181F]">Grievance Protocol:</strong>
                <br />
                Disputes must be addressed within 4 hours by the assigned Branch Mediation Officer.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-[#1F4D3D] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#173C2F]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
