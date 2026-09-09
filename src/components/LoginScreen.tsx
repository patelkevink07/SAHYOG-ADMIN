/**
 * Login Screen Component — Sahyog Admin
 * Internal authentication for Labour Cooperative Federation staff with Officer ID and Government SSO.
 */

import React, { useState } from 'react';
import {
  User,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { OfficerProfile } from '../types';
import sahyogLogo from '../assets/sahyog-logo.png';

interface LoginScreenProps {
  onLogin: (officer: OfficerProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [officerId, setOfficerId] = useState('DEL-COOP-8821');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        id: officerId || 'DEL-COOP-8821',
        name: 'Demo Admin',
        role: 'Chief Registrar & Operations Supervisor',
        branch: 'Demo Admin',
        sessionTimestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-center items-center px-4 py-12 text-[#14181F]">
      {/* Container card */}
      <div className="w-full max-w-[420px] bg-white border border-[#E7E5E1] rounded-[10px] p-8 shadow-xs space-y-6">
        {/* Header Branding with Sahyog Logo */}
        <div className="space-y-3 text-center flex flex-col items-center">
          {/* Light surface container for black line-art logo */}
          <div className="w-full max-w-[280px] bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] p-3 shadow-xs flex items-center justify-center">
            <img
              src={sahyogLogo}
              alt="Sahyog Logo"
              className="w-full h-18 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C9A227]">
                SIH26089 · Internal Portal
              </span>
            </div>
            <h1 className="text-[18px] font-bold text-[#14181F] tracking-tight mt-1">
              Federation Administration
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5 max-w-[340px] mx-auto">
              Labour Cooperative Federation Operations & Statutory Verification Portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B7280] mb-1.5">
              Cooperative Officer ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
              <input
                type="text"
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. DEL-COOP-8821"
                className="w-full bg-[#FAFAF9] pl-9 pr-3 py-2 text-[#14181F] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] font-mono text-[13px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B7280] mb-1.5">
              Secure Passkey / Token
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#FAFAF9] pl-9 pr-3 py-2 text-[#14181F] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] text-[13px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#1F4D3D] hover:bg-[#173C2F] text-white font-medium text-[13px] rounded-[8px] transition flex items-center justify-center gap-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
          >
            {isLoading ? (
              <span>Authenticating Credentials...</span>
            ) : (
              <>
                <span>Enter Federation Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] text-[11px] text-[#6B7280] leading-relaxed">
          <strong className="text-[#14181F]">Restricted Internal System:</strong> Unauthorized access is punishable under Section 43 of the Information Technology Act. All officer actions and escrow approvals are logged with cryptographic audit hashes.
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-8 text-center text-[12px] text-[#6B7280] space-y-1">
        <p>Ministry of Cooperation Hackathon · Project SIH26089</p>
        <p className="text-[11px] font-mono">Build Release v2.4.8 · Co-operative Federation Direct URL Access Only</p>
      </div>
    </div>
  );
};
