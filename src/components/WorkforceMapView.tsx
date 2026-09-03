/**
 * Workforce Map & Allocation View — Sahyog Admin
 * Interactive tactical sector map showing worker distribution, depot kiosks, and capacity re-allocation.
 */

import React, { useState } from 'react';
import {
  MapPin,
  Radio,
  Users,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ZoneAllocation } from '../types';

interface WorkforceMapViewProps {
  zones: ZoneAllocation[];
  onReallocate: (fromZoneId: string, toZoneId: string, count: number) => void;
}

export const WorkforceMapView: React.FC<WorkforceMapViewProps> = ({
  zones,
  onReallocate,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-nw');
  const [reallocating, setReallocating] = useState(false);
  const [reallocateSuccess, setReallocateSuccess] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleQuickReallocation = () => {
    // Reallocate 10 workers from North-West (surplus) to Okhla (deficit)
    onReallocate('zone-nw', 'zone-se', 10);
    setReallocateSuccess('Transferred 10 standby technicians to Okhla & Jasola Industrial sector.');
    setTimeout(() => setReallocateSuccess(null), 4000);
  };

  // Mock active workers in the selected zone
  const zoneWorkers = [
    { id: 'w1', name: 'Ramesh Chand Verma', trade: 'Plumbing', status: 'on_job', location: 'Sec 14, Block B', jobRef: 'BK-84918' },
    { id: 'w2', name: 'Nadeem Khan', trade: 'HVAC & Refrigeration', status: 'travelling', location: 'Near Depot Kiosk 2', jobRef: 'BK-84915' },
    { id: 'w3', name: 'Harish Chander', trade: 'Electrical & Wiring', status: 'on_job', location: 'Model Town III', jobRef: 'BK-84920' },
    { id: 'w4', name: 'Urmila Devi', trade: 'Home Sanitization', status: 'standby', location: 'Cooperative Depot Standby Hub', jobRef: '-' },
    { id: 'w5', name: 'Mukesh Pal', trade: 'Electrical & Wiring', status: 'standby', location: 'Sector Depot 4', jobRef: '-' },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              Workforce Map & Sector Allocation
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#BCEDD7]/40 text-[#002116]">
              Real-Time Telemetry
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Geographic dispatch density, depot kiosk status, and active field artisan distribution
          </p>
        </div>

        {reallocateSuccess && (
          <div className="text-[12px] bg-[#BCEDD7]/60 text-[#002116] px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#1F4D3D]" />
            <span>{reallocateSuccess}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Tactical Zone Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tactical Vector Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1F4D3D]" />
              <h3 className="text-[14px] font-bold text-[#14181F]">
                Delhi Cooperative Operational Sectors
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F4D3D]"></span>
                <span>Adequate</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]"></span>
                <span>Deficit Risk</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                <span>Depot Kiosk</span>
              </span>
            </div>
          </div>

          {/* Interactive SVG Sector Map Canvas */}
          <div className="relative my-4 h-[420px] w-full bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] overflow-hidden flex items-center justify-center select-none">
            {/* Background Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#14181F" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* NCT of Delhi Interactive Sector Polygons */}
            <svg viewBox="0 0 600 500" className="w-full h-full p-4">
              {/* Sector 1: North-West (Rohini & Pitampura) */}
              <g
                onClick={() => setSelectedZoneId('zone-nw')}
                className="cursor-pointer transition-all duration-200 group"
              >
                <polygon
                  points="140,60 300,50 330,170 210,240 100,180"
                  fill={selectedZoneId === 'zone-nw' ? '#BCEDD7' : '#FFFFFF'}
                  stroke={selectedZoneId === 'zone-nw' ? '#1F4D3D' : '#E7E5E1'}
                  strokeWidth={selectedZoneId === 'zone-nw' ? '2.5' : '1.5'}
                  className="transition-colors group-hover:fill-[#BCEDD7]/50"
                />
                <text x="170" y="130" className="text-[12px] font-bold fill-[#14181F] pointer-events-none">
                  North-West Hub
                </text>
                <text x="170" y="150" className="text-[10px] fill-[#6B7280] font-mono pointer-events-none">
                  Rohini · 98% Cap
                </text>
                {/* Depot Kiosk Pin */}
                <rect x="230" y="110" width="12" height="12" rx="2" fill="#2563EB" />
                {/* Active Worker Pips */}
                <circle cx="160" cy="100" r="4" fill="#1F4D3D" />
                <circle cx="210" cy="80" r="4" fill="#1F4D3D" />
                <circle cx="270" cy="120" r="4" fill="#1F4D3D" />
                <circle cx="180" cy="180" r="4" fill="#1F4D3D" />
              </g>

              {/* Sector 2: Central & Civil Lines */}
              <g
                onClick={() => setSelectedZoneId('zone-cz')}
                className="cursor-pointer transition-all duration-200 group"
              >
                <polygon
                  points="300,50 440,80 430,230 330,170"
                  fill={selectedZoneId === 'zone-cz' ? '#BCEDD7' : '#FFFFFF'}
                  stroke={selectedZoneId === 'zone-cz' ? '#1F4D3D' : '#E7E5E1'}
                  strokeWidth={selectedZoneId === 'zone-cz' ? '2.5' : '1.5'}
                  className="transition-colors group-hover:fill-[#BCEDD7]/50"
                />
                <text x="335" y="130" className="text-[12px] font-bold fill-[#14181F] pointer-events-none">
                  Central Zone
                </text>
                <text x="335" y="150" className="text-[10px] fill-[#6B7280] font-mono pointer-events-none">
                  CP & Civil Lines · 84%
                </text>
                <rect x="380" y="170" width="12" height="12" rx="2" fill="#2563EB" />
                <circle cx="360" cy="100" r="4" fill="#1F4D3D" />
                <circle cx="400" cy="140" r="4" fill="#1F4D3D" />
              </g>

              {/* Sector 3: West & Dwarka Grid */}
              <g
                onClick={() => setSelectedZoneId('zone-sw')}
                className="cursor-pointer transition-all duration-200 group"
              >
                <polygon
                  points="100,180 210,240 240,380 90,360"
                  fill={selectedZoneId === 'zone-sw' ? '#BCEDD7' : '#FFFFFF'}
                  stroke={selectedZoneId === 'zone-sw' ? '#1F4D3D' : '#E7E5E1'}
                  strokeWidth={selectedZoneId === 'zone-sw' ? '2.5' : '1.5'}
                  className="transition-colors group-hover:fill-[#BCEDD7]/50"
                />
                <text x="120" y="270" className="text-[12px] font-bold fill-[#14181F] pointer-events-none">
                  Dwarka Grid
                </text>
                <text x="120" y="290" className="text-[10px] fill-[#6B7280] font-mono pointer-events-none">
                  Sector Grid · 92%
                </text>
                <rect x="180" y="320" width="12" height="12" rx="2" fill="#2563EB" />
                <circle cx="150" cy="230" r="4" fill="#1F4D3D" />
                <circle cx="190" cy="270" r="4" fill="#1F4D3D" />
                <circle cx="130" cy="320" r="4" fill="#1F4D3D" />
              </g>

              {/* Sector 4: South-East & Okhla (Deficit Zone) */}
              <g
                onClick={() => setSelectedZoneId('zone-se')}
                className="cursor-pointer transition-all duration-200 group"
              >
                <polygon
                  points="240,380 210,240 430,230 490,340 370,440"
                  fill={selectedZoneId === 'zone-se' ? '#FFF9E6' : '#FFFFFF'}
                  stroke={selectedZoneId === 'zone-se' ? '#C9A227' : '#E7E5E1'}
                  strokeWidth={selectedZoneId === 'zone-se' ? '2.5' : '1.5'}
                  className="transition-colors group-hover:fill-[#FFF9E6]"
                />
                <text x="290" y="310" className="text-[12px] font-bold fill-[#14181F] pointer-events-none">
                  Okhla & Jasola
                </text>
                <text x="290" y="330" className="text-[10px] fill-[#755B00] font-mono font-bold pointer-events-none">
                  DEFICIT RISK · 76%
                </text>
                <rect x="340" y="360" width="12" height="12" rx="2" fill="#2563EB" />
                <circle cx="280" cy="260" r="4" fill="#C9A227" />
                <circle cx="380" cy="290" r="4" fill="#C9A227" />
                <circle cx="310" cy="370" r="4" fill="#C9A227" />
              </g>
            </svg>

            {/* Floating Sector Overlay Badge */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#E7E5E1] rounded-[6px] px-2.5 py-1.5 text-[11px] shadow-xs">
              <span className="text-[#6B7280]">Active Selected Sector: </span>
              <span className="font-bold text-[#14181F]">{selectedZone.name}</span>
            </div>
          </div>

          {/* Map Controls / Re-allocation Banner */}
          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2 text-[#414944]">
              <AlertCircle className="w-4 h-4 text-[#755B00]" />
              <span>Okhla industrial zone has 14 standby technicians (under 20 safety threshold).</span>
            </div>
            <button
              onClick={handleQuickReallocation}
              className="px-3 py-1 bg-[#1F4D3D] hover:bg-[#173C2F] text-white text-[11px] font-medium rounded-[6px] transition flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Re-allocate 10 to Okhla</span>
            </button>
          </div>
        </div>

        {/* Right: Sector Operational Breakdown (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Zone Overview Card */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
              <div>
                <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
                  {selectedZone.sectorCode}
                </span>
                <h3 className="text-[16px] font-bold text-[#14181F] leading-tight">
                  {selectedZone.name}
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  selectedZone.deficitStatus === 'moderate_deficit'
                    ? 'bg-[#FFE08E]/60 text-[#755B00]'
                    : 'bg-[#BCEDD7]/50 text-[#002116]'
                }`}
              >
                {selectedZone.coveragePercentage}% Coverage
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
                <div className="text-[11px] text-[#6B7280]">On Duty</div>
                <div className="text-[18px] font-bold text-[#14181F] tabular-nums mt-0.5">
                  {selectedZone.onDuty}
                </div>
              </div>
              <div className="p-2.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
                <div className="text-[11px] text-[#6B7280]">On Job</div>
                <div className="text-[18px] font-bold text-[#1F4D3D] tabular-nums mt-0.5">
                  {selectedZone.onJob}
                </div>
              </div>
              <div className="p-2.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
                <div className="text-[11px] text-[#6B7280]">Standby</div>
                <div className="text-[18px] font-bold text-[#14181F] tabular-nums mt-0.5">
                  {selectedZone.standby}
                </div>
              </div>
            </div>

            {/* Primary Trade Guilds Represented */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-[#6B7280]">
                Guild Branches Active in Sector:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedZone.primaryTrades.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-[#F1F1EF] border border-[#E7E5E1] px-2 py-0.5 rounded text-[#14181F]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Depot Kiosk Telemetry */}
            <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#14181F] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Cooperative Depot Kiosk #4
                </span>
                <span className="text-[10px] text-[#1F4D3D] bg-[#BCEDD7]/50 px-1.5 py-0.2 rounded font-mono">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] space-y-0.5">
                <div>Biometric punch gate: <span className="text-[#14181F]">100% operational</span></div>
                <div>Tool dispensary locker inventory: <span className="text-[#14181F]">84/90 items present</span></div>
                <div>Emergency first-aid locker: <span className="text-[#1F4D3D] font-medium">Inspected Today</span></div>
              </div>
            </div>
          </div>

          {/* Active Field Workers Table in Selected Zone */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E1]">
              <h4 className="text-[13px] font-bold text-[#14181F]">
                Active Artisans in {selectedZone.name}
              </h4>
              <span className="text-[11px] text-[#6B7280] tabular-nums">
                5 displayed of {selectedZone.onDuty}
              </span>
            </div>

            <div className="divide-y divide-[#E7E5E1] mt-2 text-[12px]">
              {zoneWorkers.map((w) => (
                <div key={w.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#14181F]">{w.name}</div>
                    <div className="text-[11px] text-[#6B7280]">
                      {w.trade} · {w.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        w.status === 'on_job'
                          ? 'bg-[#BCEDD7]/50 text-[#002116]'
                          : w.status === 'travelling'
                          ? 'bg-[#FFE08E]/50 text-[#755B00]'
                          : 'bg-[#F1F1EF] text-[#6B7280]'
                      }`}
                    >
                      {w.status === 'on_job' ? 'On Job' : w.status === 'travelling' ? 'Travelling' : 'Standby'}
                    </span>
                    {w.jobRef !== '-' && (
                      <div className="font-mono text-[10px] text-[#6B7280] mt-0.5">
                        {w.jobRef}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
