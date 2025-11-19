import React from 'react';
import { User, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { LayoutDashboard, BookOpen, CheckCircle, Users, Settings, LogOut, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Note: We will use HashRouter, but imports are consistent

interface SidebarProps {
  user: User;
  currentLang: Language;
  onLogout: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentLang, onLogout, onLanguageChange }) => {
  const t = TRANSLATIONS;
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => `flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
    isActive(path) 
      ? 'bg-indigo-50 text-indigo-600' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Briefcase className="h-8 w-8 text-indigo-600 mr-3" />
        <span className="text-xl font-bold text-slate-900">FinanzaCore</span>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
        <nav className="flex-1 space-y-1">
          <Link to="/" className={linkClass('/')}>
            <LayoutDashboard size={20} className="mr-3" />
            {t.dashboard[currentLang]}
          </Link>

          <Link to="/accounting" className={linkClass('/accounting')}>
            <BookOpen size={20} className="mr-3" />
            {t.accounting[currentLang]}
          </Link>

          <Link to="/reconciliation" className={linkClass('/reconciliation')}>
            <CheckCircle size={20} className="mr-3" />
            {t.reconciliation[currentLang]}
          </Link>

          {user.role === UserRole.ADMIN && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t.admin_panel[currentLang]}
                </p>
              </div>
              <Link to="/users" className={linkClass('/users')}>
                <Users size={20} className="mr-3" />
                {t.users[currentLang]}
              </Link>
              <Link to="/settings" className={linkClass('/settings')}>
                <Settings size={20} className="mr-3" />
                {t.settings[currentLang]}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 space-y-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => onLanguageChange(Language.ES)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              currentLang === Language.ES ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Español
          </button>
          <button
            onClick={() => onLanguageChange(Language.DE)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
              currentLang === Language.DE ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Deutsch
          </button>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          {t.logout[currentLang]}
        </button>
      </div>
    </div>
  );
};