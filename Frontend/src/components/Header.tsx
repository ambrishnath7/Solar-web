import React from 'react';
import { ClipboardCheck, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'admin';
  onViewChange: (view: 'form' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand Logo - clean image filling the header area */}
        <div className="flex items-center py-0.5">
          <img
            src="/logo.jpeg"
            alt="Shree Abhi Electricals & Engineering Pvt. Ltd."
            className="h-10 sm:h-12 md:h-14 w-auto max-w-[200px] sm:max-w-[280px] md:max-w-[340px] object-contain"
          />
        </div>

        {/* Navigation & Connection Pill */}
        <div className="flex items-center gap-2">
          {/* Online/Offline status pill */}
          <div
            className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
              isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
            title={isOnline ? 'System Online' : 'Operating Offline'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onViewChange('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentView === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Field</span> PMC
            </button>
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
