
import React from 'react';
import { ShieldAlert, Home } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const t = TRANSLATIONS;
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6 ring-8 ring-red-50/50">
                <ShieldAlert className="h-10 w-10 text-red-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                {t.permission_denied[currentLang]}
            </h2>
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6">
                {t.error_403[currentLang]}
            </p>
            
            <p className="text-slate-500 mb-8 text-base leading-relaxed">
                {t.access_denied_msg[currentLang]}
            </p>
            
            <div className="flex justify-center">
                <Button onClick={() => navigate('/')} size="lg" icon={<Home size={18} />}>
                    {t.go_back[currentLang]}
                </Button>
            </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
                Security Event ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
        </div>
      </div>
    </div>
  );
};
