import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MOCK_USERS, TRANSLATIONS } from '../constants';
import { Language, UserRole } from '../types';
import { Trash2, Shield, Edit3, AlertTriangle } from 'lucide-react';

export const Users: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const t = TRANSLATIONS;
  const [showWipeModal, setShowWipeModal] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.admin_panel[currentLang]}</h1>
        <p className="text-slate-500 text-sm">System Configuration & User Roles</p>
      </div>

      {/* User Management Table */}
      <Card title={t.users[currentLang]}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.role[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {MOCK_USERS.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img className="h-8 w-8 rounded-full mr-3" src={u.avatar} alt="" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500">@{u.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 
                      u.role === UserRole.MANAGER ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {u.permissions.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit3 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Clean Slate / Borrón Zone */}
      <div className="border border-red-200 rounded-xl bg-red-50 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">{t.clean_slate[currentLang]}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{t.clean_slate_desc[currentLang]}</p>
              <ul className="list-disc list-inside mt-1 text-xs opacity-80">
                <li>Archives current data to historical tables.</li>
                <li>Generates a full system backup.</li>
                <li>Resets GL balances (retained earnings).</li>
              </ul>
            </div>
            <div className="mt-4">
              <Button 
                variant="danger" 
                onClick={() => setShowWipeModal(true)}
                icon={<Trash2 size={16} />}
              >
                {t.execute_wipe[currentLang]}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Wipe Confirmation */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Clean Slate</h3>
            <p className="text-slate-600 mb-4">
              Please type <strong>CONFIRM-RESET</strong> to proceed. This action cannot be undone easily.
            </p>
            <input type="text" className="w-full border border-slate-300 rounded p-2 mb-4" placeholder="CONFIRM-RESET" />
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowWipeModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setShowWipeModal(false)}>Confirm & Wipe</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};