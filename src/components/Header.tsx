/**
 * Header Component — Sahyog Admin
 * Desktop-first dock header with global search, district selector, dispatch status, notifications & export.
 */

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
} from 'lucide-react';
import { OfficerUser, NavigationSection } from '../types';
import sahyogLogo from '../assets/sahyog-logo.png';

export interface HeaderProps {
  currentOfficer?: OfficerUser | null;
  officer?: OfficerUser | null;
  currentSection?: NavigationSection;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  toggleSidebar?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOfficer,
  officer,
  searchQuery = '',
  onSearchChange = (_q: string) => {},
  toggleSidebar,
  onToggleSidebar,
  isSidebarCollapsed = false,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleToggleSidebar = onToggleSidebar || toggleSidebar || (() => {});
  const activeOfficer = officer || currentOfficer;
  const officerInitials =
    activeOfficer?.name
      ?.split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('') || 'SO';

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
      title: 'Biometric System Synced',
      time: '1 hr ago',
      desc: 'Central biometric verification gateway re-synchronized successfully.',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-[#FAFAF9] border-b border-[#E7E5E1] sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar toggle, Brand Logo & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={handleToggleSidebar}
          className="p-1.5 text-[#6B7280] hover:text-[#14181F] hover:bg-white rounded-[8px] border border-transparent hover:border-[#E7E5E1] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition-colors flex-shrink-0"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Sahyog Brand Logo on Light Backing Panel */}
        <div className="flex items-center gap-2 pr-2 border-r border-[#E7E5E1] flex-shrink-0">
          <div className="h-8 px-2 py-0.5 bg-white border border-[#E7E5E1] rounded-[6px] shadow-xs flex items-center justify-center">
            <img
              src={sahyogLogo}
              alt="Sahyog Logo"
              className="h-6 w-auto max-w-[90px] object-contain"
            />
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-[#1F4D3D] tracking-wider uppercase">
            Admin
          </span>
        </div>

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

      {/* Right Controls: Notification Bell & Officer Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-[#6B7280] hover:text-[#14181F] hover:bg-white rounded-[8px] border border-transparent hover:border-[#E7E5E1] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition cursor-pointer"
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

        {/* Officer Profile Pill */}
        {activeOfficer && (
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#E7E5E1]">
            <div className="h-8 w-8 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center font-semibold text-[12px] flex-shrink-0">
              {officerInitials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-semibold text-[#14181F] leading-tight">
                {activeOfficer.name}
              </span>
              <span className="text-[10px] text-[#6B7280] max-w-[150px] truncate">
                {activeOfficer.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
