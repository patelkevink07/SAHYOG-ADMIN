/**
 * AI Demand Forecast Analytics View — Sahyog Admin
 * Chart of predicted demand with plain-language operational summaries and technician pre-dispatch actions.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  CloudSun,
  Send,
  Check,
  Radio,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { ForecastDay } from '../types';

interface AiForecastAnalyticsViewProps {
  forecastDays: ForecastDay[];
  onBroadcastAlert: () => void;
  alertBroadcasted: boolean;
}

export const AiForecastAnalyticsView: React.FC<AiForecastAnalyticsViewProps> = ({
  forecastDays,
  onBroadcastAlert,
  alertBroadcasted,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<'electrical' | 'plumbing' | 'care'>('electrical');
  const [weatherCondition, setWeatherCondition] = useState<'heatwave' | 'normal' | 'rain'>('heatwave');

  // Trade specific demand multiplier
  const multiplier = weatherCondition === 'heatwave' ? 1.34 : weatherCondition === 'rain' ? 1.15 : 1.0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E7E5E1] pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#14181F] tracking-tight">
              AI Demand Forecast Analytics
            </h2>
            <span className="text-[11px] font-bold bg-[#F1F3FE] text-[#1F4D3D] px-2 py-0.5 rounded border border-[#E7E5E1]">
              Gemini 1.5 Pro Predictive Model
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Weather telemetry, civic historical workload, and automated artisan pre-allocation forecasting
          </p>
        </div>

        {/* Action Trigger */}
        <button
          onClick={onBroadcastAlert}
          disabled={alertBroadcasted}
          className={`px-3.5 py-1.5 text-[12px] font-medium rounded-[8px] transition flex items-center gap-1.5 ${
            alertBroadcasted
              ? 'bg-[#BCEDD7] text-[#002116]'
              : 'bg-[#1F4D3D] hover:bg-[#173C2F] text-white focus:outline-none focus:ring-1 focus:ring-[#1F4D3D]'
          }`}
        >
          {alertBroadcasted ? (
            <>
              <Check className="w-4 h-4" />
              <span>Standby Alert Broadcasted to 28 Artisans</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Standby Mobilization Alert</span>
            </>
          )}
        </button>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
            Trade Guild:
          </span>
          <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
            <button
              onClick={() => setSelectedTrade('electrical')}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                selectedTrade === 'electrical'
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              HVAC & Electrical
            </button>
            <button
              onClick={() => setSelectedTrade('plumbing')}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                selectedTrade === 'plumbing'
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              Plumbing & Drainage
            </button>
            <button
              onClick={() => setSelectedTrade('care')}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition ${
                selectedTrade === 'care'
                  ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              Geriatric & Home Care
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
            Weather Scenario:
          </span>
          <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 border border-[#E7E5E1] rounded-[8px]">
            <button
              onClick={() => setWeatherCondition('heatwave')}
              className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition ${
                weatherCondition === 'heatwave'
                  ? 'bg-[#B91C1C] text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              Heatwave (41°C)
            </button>
            <button
              onClick={() => setWeatherCondition('normal')}
              className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition ${
                weatherCondition === 'normal'
                  ? 'bg-[#1F4D3D] text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              Normal (34°C)
            </button>
            <button
              onClick={() => setWeatherCondition('rain')}
              className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition ${
                weatherCondition === 'rain'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              Monsoon Rain
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Visualization + Plain-Language Briefings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7-Day Demand Forecast Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E5E1] rounded-[10px] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
              <div>
                <h3 className="text-[14px] font-bold text-[#14181F]">
                  7-Day Projected Workload Curve
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  Delhi NCT Cooperative Federation Service Demand Index
                </p>
              </div>
              <span className="text-[12px] font-bold text-[#14181F] tabular-nums">
                Peak: Sunday (482 Bookings)
              </span>
            </div>

            {/* SVG Interactive Multi-Bar Chart */}
            <div className="mt-6 mb-2">
              <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
                {forecastDays.map((day) => {
                  const baseVal =
                    selectedTrade === 'electrical'
                      ? day.electricalDemandIndex
                      : selectedTrade === 'plumbing'
                      ? day.plumbingDemandIndex
                      : 65;
                  const adjustedVal = Math.min(100, Math.round(baseVal * (weatherCondition === 'heatwave' && selectedTrade === 'electrical' ? 1.25 : 1.0)));
                  const isPeak = day.surgeStatus === 'peak';

                  return (
                    <div key={day.dayName} className="flex flex-col items-center flex-1 h-full justify-end gap-1.5 group">
                      {/* Tooltip value */}
                      <span className="text-[10px] text-[#6B7280] font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(day.projectedBookings * multiplier)}
                      </span>

                      {/* Bar Column */}
                      <div className="w-full max-w-[42px] bg-[#FAFAF9] rounded-t overflow-hidden border border-[#E7E5E1] h-full flex items-end">
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            isPeak
                              ? 'bg-[#1F4D3D]'
                              : day.surgeStatus === 'surge'
                              ? 'bg-[#BCEDD7]'
                              : 'bg-[#E5E8F2]'
                          }`}
                          style={{ height: `${adjustedVal}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className="text-[11px] font-medium text-[#14181F]">
                        {day.dayName}
                      </span>
                      {/* Weather Tag */}
                      <span className="text-[9px] text-[#6B7280] tabular-nums font-mono">
                        {day.temperature}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex items-center justify-between text-[11px] text-[#6B7280]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#1F4D3D]"></span>
                    <span>Peak Surge Day (120%+ Normal)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#BCEDD7]"></span>
                    <span>Elevated Demand</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#E5E8F2]"></span>
                    <span>Baseline Capacity</span>
                  </span>
                </div>
                <span>Source: IMD Delhi Weather Grid API</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Bar */}
          <div className="mt-4 p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] grid grid-cols-3 gap-2 text-center text-[12px]">
            <div>
              <span className="text-[11px] text-[#6B7280]">Peak Projected Day</span>
              <div className="font-bold text-[#14181F] mt-0.5">Sunday 20-Apr</div>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280]">Expected HVAC Deficit</span>
              <div className="font-bold text-[#B91C1C] mt-0.5 tabular-nums">-18 Technicians</div>
            </div>
            <div>
              <span className="text-[11px] text-[#6B7280]">Recommended Pre-Alert</span>
              <div className="font-bold text-[#1F4D3D] mt-0.5 tabular-nums">28 Certified Guilds</div>
            </div>
          </div>
        </div>

        {/* Right Column: Plain-Language Operational Briefings (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Briefing 1: Primary Heatwave / Electrical Briefing */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E1]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1F4D3D]" />
                <h4 className="text-[13px] font-bold text-[#14181F]">
                  Executive Operations Briefing
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-[#B91C1C] bg-red-50 px-1.5 py-0.5 rounded">
                High Priority
              </span>
            </div>

            <p className="text-[12px] text-[#14181F] leading-relaxed">
              <strong>Meteorological Correlation:</strong> Severe heatwave conditions predicted across West and South-West Delhi over the coming 72 hours with peak temperatures exceeding 42°C.
            </p>

            <p className="text-[12px] text-[#414944] leading-relaxed">
              Historically, this causes a <strong>34% to 41% spike in domestic AC capacitor failures, circuit breaker trips, and refrigeration emergency calls</strong> in Dwarka, Janakpuri, and Rohini sectors.
            </p>

            <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] space-y-1.5 text-[11px]">
              <span className="font-bold text-[#14181F] uppercase tracking-wider text-[10px]">
                Recommended Staff Actions:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[#414944]">
                <li>Broadcast voluntary standby shift notifications to 28 certified electricians.</li>
                <li>Stock 40 additional dual-run capacitors at Cooperative Depot Kiosks 1 & 4.</li>
                <li>Activate 15-minute dispatch priority for households with registered senior citizens.</li>
              </ul>
            </div>
          </div>

          {/* Briefing 2: Drainage & Plumbing Readiness */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E1]">
              <h4 className="text-[13px] font-bold text-[#14181F]">
                Monsoon Drainage Preparedness
              </h4>
              <span className="text-[10px] font-medium text-[#6B7280]">
                Civil Lines & Okhla
              </span>
            </div>

            <p className="text-[12px] text-[#414944] leading-relaxed">
              Basement sump pump and overhead drainage line demand expected to remain nominal (+4%) through Friday, with slight elevation expected next week upon early thunderstorm arrivals.
            </p>
          </div>

          {/* Briefing 3: Fair Wage & Pricing Guardrail */}
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E1]">
              <h4 className="text-[13px] font-bold text-[#14181F]">
                Cooperative Fair Price Guardrail
              </h4>
              <span className="text-[10px] text-[#1F4D3D] font-mono bg-[#BCEDD7]/50 px-1.5 py-0.2 rounded">
                Section 12 Enforced
              </span>
            </div>

            <p className="text-[12px] text-[#414944] leading-relaxed">
              Unlike private aggregator surge algorithms, Sahyog caps emergency surge premiums at 15%, directing 100% of the premium directly to the performing technician rather than retaining platform commission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
