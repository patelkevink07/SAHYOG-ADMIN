import React, { useState, useEffect } from 'react';
import { Search, Star, ShieldCheck, Hammer, Activity, Clock, FileBadge } from 'lucide-react';
import { FirestoreWorker, subscribeToWorkers } from '../lib/workersService';

export const WorkersDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<FirestoreWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToWorkers(
      (liveWorkers) => {
        setWorkers(liveWorkers);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching live workers directory:', error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredWorkers = workers.filter((w) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.primaryServiceName.toLowerCase().includes(q) ||
      (w.registrationNumber || '').toLowerCase().includes(q) ||
      (w.federationName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-[#FAFAF9] overflow-hidden">
      {/* Header Panel */}
      <div className="flex-shrink-0 bg-white border-b border-[#E7E5E1] p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold text-[#14181F] tracking-tight">Workers Directory</h1>
            <p className="text-[13px] text-[#6B7280] mt-1 max-w-2xl">
              Live audit view of all cooperative workers. This directory reads directly from the live citizen-facing database.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#6B7280]" />
              </div>
              <input
                type="text"
                placeholder="Search workers, trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-[#14181F] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-[#6B7280] text-[13px]">
            <Activity className="w-5 h-5 mr-2 animate-spin text-[#1F4D3D]" />
            Loading live workers directory...
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border border-[#E7E5E1] shadow-sm">
              <Search className="w-5 h-5 text-[#6B7280]" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#14181F]">No workers found</h3>
            <p className="text-[12px] text-[#6B7280] mt-1 max-w-[250px]">
              No worker profiles matched your current search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
            {filteredWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-[10px] border border-[#E7E5E1] p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Profile Header */}
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-[#F1F3FE] border border-[#E7E5E1] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {worker.photoUrl ? (
                      <img src={worker.photoUrl} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[18px] font-bold text-[#1F4D3D]">
                        {worker.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-[#14181F] truncate leading-tight">
                        {worker.name}
                      </h3>
                      {worker.isOnline !== undefined && (
                        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          worker.isOnline ? 'bg-[#BCEDD7]/40 text-[#1F4D3D]' : 'bg-[#FAFAF9] border border-[#E7E5E1] text-[#6B7280]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${worker.isOnline ? 'bg-[#1F4D3D]' : 'bg-[#6B7280]'}`} />
                          {worker.isOnline ? 'Online' : 'Offline'}
                        </div>
                      )}
                    </div>
                    <div className="text-[12px] font-medium text-[#414944] mt-0.5 truncate">
                      {worker.primaryServiceName}
                    </div>
                    <div className="text-[11px] text-[#6B7280] truncate mt-0.5">
                      {worker.registrationNumber || `COOP-${worker.id.toUpperCase()}`}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E7E5E1]">
                  <div className="flex flex-col gap-1 items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-[13px] font-bold text-[#14181F]">
                      <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
                      {worker.rating?.toFixed(1) || '4.9'}
                    </div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">
                      {worker.reviewCount || 0} Reviews
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center text-center border-l border-[#E7E5E1]">
                    <div className="text-[13px] font-bold text-[#14181F]">
                      ₹{worker.hourlyRate || 350}/hr
                    </div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">
                      Rate
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center text-center border-l border-[#E7E5E1]">
                    <div className="text-[13px] font-bold text-[#14181F]">
                      {worker.completedJobs || 0}
                    </div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">
                      Jobs Done
                    </div>
                  </div>
                </div>

                {/* Badges & Tags */}
                <div className="flex flex-wrap gap-1.5">
                  <div className="flex items-center gap-1 bg-[#FAFAF9] border border-[#E7E5E1] px-2 py-1 rounded text-[10px] font-semibold text-[#414944]">
                    <ShieldCheck className="w-3 h-3 text-[#1F4D3D]" />
                    {worker.policeVerified ? 'Police Verified' : 'Unverified'}
                  </div>
                  {worker.emergencyAvailable && (
                    <div className="flex items-center gap-1 bg-[#FFF5F5] border border-[#FECDD3] px-2 py-1 rounded text-[10px] font-semibold text-[#B91C1C]">
                      <Activity className="w-3 h-3" />
                      Emergency Ready
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-[#FAFAF9] border border-[#E7E5E1] px-2 py-1 rounded text-[10px] font-semibold text-[#414944]">
                    <Clock className="w-3 h-3 text-[#6B7280]" />
                    Since {worker.memberSinceYear || 2020}
                  </div>
                </div>

                {/* Status & Subservices */}
                <div className="mt-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-medium">Compliance Status:</span>
                    <span className={`px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider ${
                      worker.status === 'approved' ? 'bg-[#BCEDD7]/30 text-[#1F4D3D]' :
                      worker.status === 'rejected' ? 'bg-[#FFDAD6]/50 text-[#93000A]' :
                      worker.status === 'held' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                      'bg-[#FFF3C4]/60 text-[#755B00]'
                    }`}>
                      {worker.status || 'approved'}
                    </span>
                  </div>
                  
                  {worker.subservices && worker.subservices.length > 0 && (
                    <div className="flex items-start gap-2 text-[11px] mt-1">
                      <Hammer className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <div className="text-[#414944] leading-tight">
                        <span className="text-[#6B7280]">Skills:</span> {worker.subservices.join(', ')}
                      </div>
                    </div>
                  )}

                  {worker.certifications && worker.certifications.length > 0 && (
                    <div className="flex items-start gap-2 text-[11px]">
                      <FileBadge className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <div className="text-[#414944] leading-tight">
                        <span className="text-[#6B7280]">Certs:</span> {worker.certifications[0]}
                        {worker.certifications.length > 1 && ` +${worker.certifications.length - 1} more`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Federation Footer */}
                <div className="mt-auto pt-3 border-t border-[#FAFAF9]">
                  <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider truncate text-center">
                    {worker.federationName || 'Delhi Shramik Federation'}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
