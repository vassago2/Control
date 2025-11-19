import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Language, TranslationDictionary } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: (u: string, p: string) => Promise<void>;
  currentLang: Language;
}

export const Login: React.FC<LoginProps> = ({ onLogin, currentLang }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = TRANSLATIONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError('Credenciales inválidas / Ungültige Anmeldeinformationen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-800 to-indigo-600 skew-y-3 origin-top-left transform -translate-y-20 z-0"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="flex justify-center mb-8">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Briefcase className="h-10 w-10 text-indigo-600" />
              </div>
            </div>
            
            <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">
              FinanzaCore
            </h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
              {t.login_title[currentLang]}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.username[currentLang]}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Tony"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.password[currentLang]}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Barros"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '...' : t.login_btn[currentLang]}
              </Button>
            </form>
          </div>
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400">
               Demo Credentials: Tony / Barros
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};