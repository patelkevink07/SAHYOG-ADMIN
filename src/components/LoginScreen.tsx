/**
 * Login Screen Component — Sahyog Admin
 * Internal authentication for Labour Cooperative Federation staff with Officer ID and Government SSO.
 */

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { OfficerProfile } from '../types';

interface LoginScreenProps {
  onLogin: (officer: OfficerProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [officerId, setOfficerId] = useState('DEL-COOP-8821');
  const [password, setPassword] = useState('••••••••••••');
  const [branch, setBranch] = useState('Delhi State Labour Cooperative Federation');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        id: officerId || 'DEL-COOP-8821',
        name: 'Officer A. Sharma',
        role: 'Chief Registrar & Operations Supervisor',
        branch: branch,
        sessionTimestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setIsLoading(false);
    }, 400);
  };

  const handleJanParichaySso = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'GOV-SSO-9412',
        name: 'Officer V. K. Malhotra',
        role: 'Zonal Registrar — North Delhi',
        branch: 'Delhi State Labour Cooperative Federation (Zonal Hub)',
        sessionTimestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-center items-center px-4 py-12 text-[#14181F]">
      {/* Container card */}
      <div className="w-full max-w-[420px] bg-white border border-[#E7E5E1] rounded-[10px] p-8 shadow-xs space-y-6">
        {/* Header Branding */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[10px] bg-[#1F4D3D] text-white mx-auto shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C9A227]">
                SIH26089 · Internal Portal
              </span>
            </div>
            <h1 className="text-[22px] font-bold text-[#14181F] tracking-tight">
              Sahyog Admin
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
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

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B7280] mb-1.5">
              Federation Branch Registry
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-[#FAFAF9] px-3 py-2 text-[#14181F] border border-[#E7E5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] text-[12px]"
            >
              <option>Delhi State Labour Cooperative Federation (Headquarters)</option>
              <option>North Delhi Zonal Cooperative Depot</option>
              <option>South-West Dwarka Labour Guild Branch</option>
              <option>East Delhi Industrial Cooperative Office</option>
            </select>
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

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#E7E5E1]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#6B7280]">
            Official Government SSO
          </span>
          <div className="flex-grow border-t border-[#E7E5E1]"></div>
        </div>

        {/* SSO Option */}
        <button
          type="button"
          onClick={handleJanParichaySso}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#14181F] font-medium text-[12px] rounded-[8px] transition flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4 text-[#1F4D3D]" />
          <span>Sign In via MeriPehchaan / Jan Parichay SSO</span>
        </button>

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
