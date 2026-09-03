import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sahyog Admin UI Caught Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sahyog_officer');
      localStorage.removeItem('sahyog_verifications');
      localStorage.removeItem('sahyog_bookings');
      localStorage.removeItem('sahyog_disputes');
      localStorage.removeItem('sahyog_payouts');
      localStorage.removeItem('sahyog_zones');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6 text-[#14181F]">
          <div className="bg-white border border-[#E7E5E1] rounded-[10px] p-8 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFDAD6] text-[#93000A] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#14181F]">
                Operations Portal Restored
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-1">
                An interface state glitch was detected. Your federation data has been preserved.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1] text-[11px] font-mono text-left text-[#B91C1C] overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-[#1F4D3D] hover:bg-[#173C2F] text-white rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 transition"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Reload Portal</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 bg-white hover:bg-[#F5F5F4] border border-[#E7E5E1] text-[#6B7280] hover:text-[#14181F] rounded-[8px] text-[12px] font-medium transition"
              >
                Reset Demo Storage & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
