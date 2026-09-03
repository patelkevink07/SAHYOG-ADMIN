/**
 * Sidebar Component — Sahyog Admin
 * Persistent left navigation with quiet section highlights, badges, and officer session footer.
 */

import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Calendar,
  Scale,
  WalletCards,
  TrendingUp,
  AlertTriangle,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavigationSection, OfficerUser } from '../types';

export interface SidebarProps {
  currentSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
  pendingVerificationsCount: number;
  openDisputesCount: number;
  pendingPayoutsCount?: number;
  currentOfficer?: OfficerUser | null;
  officer?: OfficerUser | null;
  onEmergencyClick?: () => void;
  onSettingsClick?: () => void;
  onAuditLogsClick?: () => void;
  onSignOut?: () => void;
  onLogout?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  pendingVerificationsCount,
  openDisputesCount,
  pendingPayoutsCount = 0,
  currentOfficer,
  officer,
  onEmergencyClick,
  onSettingsClick,
  onAuditLogsClick,
  onSignOut,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const activeOfficer = officer || currentOfficer;
  const officerName = activeOfficer?.name || 'Officer Staff';
  const officerId = activeOfficer?.id || activeOfficer?.badgeNumber || 'OFF-DEL-0419';
  const officerInitials = officerName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('') || 'SO';
  const handleSignOut = onLogout || onSignOut || (() => {});

  const navItems = [
    {
      id: 'dashboard' as NavigationSection,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeClass: 'bg-white text-[#1F4D3D] border border-[#E7E5E1]',
    },
    {
      id: 'verification' as NavigationSection,
      label: 'Verification Queue',
      icon: ShieldCheck,
      count: pendingVerificationsCount,
      countClass: 'bg-[#E5E8F2] text-[#14181F]',
    },
    {
      id: 'workforce-map' as NavigationSection,
      label: 'Workforce Map',
      icon: MapPin,
    },
    {
      id: 'bookings' as NavigationSection,
      label: 'Bookings',
      icon: Calendar,
    },
    {
      id: 'disputes' as NavigationSection,
      label: 'Disputes',
      icon: Scale,
      count: openDisputesCount,
      countClass: 'bg-[#FFDAD6] text-[#93000A]',
    },
    {
      id: 'payouts' as NavigationSection,
      label: 'Payouts',
      icon: WalletCards,
      count: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined,
      countClass: 'bg-[#E5E8F2] text-[#14181F]',
    },
    {
      id: 'ai-forecast' as NavigationSection,
      label: 'AI Demand Forecast',
      icon: TrendingUp,
      badge: 'Gemini',
      badgeClass: 'bg-[#BCEDD7] text-[#002116]',
    },
  ];

  return (
    <aside
      className={`h-screen flex flex-col justify-between bg-[#FAFAF9] border-r border-[#E7E5E1] select-none transition-all duration-200 flex-shrink-0 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand Identity */}
      <div className="flex flex-col">
        <div className="p-4 pb-3 border-b border-[#E7E5E1]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Cooperative Emblem */}
            <div className="h-10 w-10 min-w-[40px] rounded-[8px] bg-white border border-[#E7E5E1] p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#1F4D3D" strokeWidth="4" />
                <path
                  d="M30 62C36 48 44 42 56 46C64 49 68 44 72 38"
                  stroke="#1F4D3D"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="30" r="8" fill="#C9A227" />
                <path
                  d="M26 65C38 74 62 74 74 65"
                  stroke="#C9A227"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="34" cy="50" r="4" fill="#1F4D3D" />
                <circle cx="66" cy="50" r="4" fill="#1F4D3D" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <h1 className="text-[14px] font-bold leading-tight tracking-tight text-[#14181F] truncate">
                  Delhi Shramik Sahakari
                </h1>
                <p className="text-[11px] font-medium text-[#6B7280] tracking-tight mt-0.5 truncate">
                  Officer Console · NCCT Reg. F-8842
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Operations Workspace
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                } py-2 rounded-[8px] text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] ${
                  isActive
                    ? 'bg-[#F1F1EF] text-[#1F4D3D] border-l-[3px] border-[#1F4D3D] font-semibold'
                    : 'text-[#414944] hover:bg-[#F1F1EF] hover:text-[#14181F]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-[#1F4D3D]' : 'text-[#6B7280]'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded tabular-nums ${item.badgeClass}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${item.countClass}`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Staff Profile */}
      <div className="p-3 border-t border-[#E7E5E1] flex flex-col gap-2">
        {/* Emergency Escalation Button */}
        <button
          onClick={onEmergencyClick}
          title={isCollapsed ? 'Emergency Escalation' : undefined}
          className={`w-full flex items-center justify-center gap-2 py-2 ${
            isCollapsed ? 'px-2' : 'px-3'
          } rounded-[8px] bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[12px] font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-red-700`}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Emergency Escalation</span>}
        </button>

        {/* Secondary Navigation Links */}
        <div className="space-y-0.5 pt-1">
          <button
            onClick={onSettingsClick}
            title={isCollapsed ? 'Federation Settings' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-3'
            } py-1.5 rounded-[6px] text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F1EF] text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Federation Settings</span>}
          </button>

          <button
            onClick={onAuditLogsClick}
            title={isCollapsed ? 'Audit Logs' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-3'
            } py-1.5 rounded-[6px] text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F1EF] text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Audit Logs</span>}
          </button>
        </div>

        {/* Staff Profile Card & Logout */}
        <div className="mt-1 pt-2 border-t border-[#E7E5E1] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center font-semibold text-[12px] flex-shrink-0">
              {officerInitials}
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-[12px] font-semibold text-[#14181F] leading-tight truncate">
                  {officerName}
                </span>
                <span className="text-[10px] text-[#6B7280] tabular-nums font-mono truncate">
                  {officerId}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="text-[#6B7280] hover:text-[#B91C1C] p-1.5 rounded hover:bg-[#F1F1EF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B91C1C] cursor-pointer"
            title="Sign Out of Federation Session"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mini expand/collapse arrow toggle on desktop */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="text-[11px] text-[#6B7280] hover:text-[#14181F] flex items-center gap-1 p-1 hover:bg-[#F1F1EF] rounded focus:outline-none"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[10px]">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
