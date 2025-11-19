
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MOCK_USERS, TRANSLATIONS, AVAILABLE_PERMISSIONS } from '../constants';
import { Language, UserRole, User } from '../types';
import { Trash2, Edit3, AlertTriangle, Plus, X, Save, Shield, User as UserIcon, Lock } from 'lucide-react';

export const Users: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const t = TRANSLATIONS;
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of user being edited
  const [isCreating, setIsCreating] = useState(false);
  
  // State for forms including password and avatar which might not be in the base User type for list display
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    name: '',
    username: '',
    role: UserRole.OFFICE,
    permissions: [],
    avatar: '',
    password: ''
  });

  const handleEditClick = (user: User) => {
    setIsEditing(user.id);
    setIsCreating(false);
    setFormData({ ...user, password: '' }); // Don't show existing password
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setIsEditing(null);
    setFormData({
        name: '',
        username: '',
        role: UserRole.OFFICE,
        permissions: [],
        avatar: `https://picsum.photos/seed/${Date.now()}/200`,
        password: 'ChangeMe123!' // Default initial password
    });
  };

  const handleSave = () => {
    if (isCreating) {
        const newUser: User = {
            id: Date.now().toString(),
            name: formData.name!,
            username: formData.username!,
            role: formData.role!,
            permissions: formData.permissions || [],
            avatar: formData.avatar
        };
        setUsers([...users, newUser]);
        setIsCreating(false);
    } else if (isEditing) {
        setUsers(users.map(u => u.id === isEditing ? { ...u, ...formData } as User : u));
        setIsEditing(null);
    }
  };

  const togglePermission = (permId: string) => {
    const currentPerms = formData.permissions || [];
    if (currentPerms.includes(permId)) {
        setFormData({ ...formData, permissions: currentPerms.filter(p => p !== permId) });
    } else {
        setFormData({ ...formData, permissions: [...currentPerms, permId] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.admin_panel[currentLang]}</h1>
          <p className="text-slate-500 text-sm">System Configuration & User Roles</p>
        </div>
        {!isCreating && !isEditing && (
            <Button onClick={handleCreateClick} icon={<Plus size={16} />}>{t.create_user[currentLang]}</Button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || isEditing) && (
        <Card title={isCreating ? t.create_user[currentLang] : t.edit[currentLang]}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.name[currentLang]}</label>
                        <input 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.username[currentLang]}</label>
                        <input 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.role[currentLang]}</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                        >
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* New Fields: Avatar & Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.avatar_url[currentLang]}</label>
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={formData.avatar}
                                onChange={e => setFormData({...formData, avatar: e.target.value})}
                                placeholder="https://..."
                            />
                            {formData.avatar && (
                                <img src={formData.avatar} alt="Preview" className="h-10 w-10 rounded-full bg-slate-200 object-cover border border-slate-200" />
                            )}
                        </div>
                    </div>

                    {isCreating && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.initial_password[currentLang]}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input 
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm bg-slate-50"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">User will be prompted to change this on first login.</p>
                        </div>
                    )}
                </div>

                {/* Permission Matrix */}
                {formData.role !== UserRole.ADMIN && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                            <Shield size={16} className="mr-2 text-indigo-600"/>
                            {t.permissions[currentLang]} Matrix
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">
                            Customize access for {formData.role}. Checking a box grants explicit access.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {AVAILABLE_PERMISSIONS.map(perm => (
                                <label key={perm.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-white transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.permissions?.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="text-sm text-slate-700">{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                 {formData.role === UserRole.ADMIN && (
                    <div className="bg-purple-50 p-4 rounded-lg text-purple-800 text-sm flex items-center">
                        <Shield size={16} className="mr-2" />
                        Administrator role grants all permissions automatically (Superuser).
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                    <Button variant="secondary" onClick={() => { setIsCreating(false); setIsEditing(null); }}>
                        {t.cancel[currentLang]}
                    </Button>
                    <Button onClick={handleSave} icon={<Save size={16} />}>
                        {t.save[currentLang]}
                    </Button>
                </div>
            </div>
        </Card>
      )}

      {/* User Management Table */}
      <Card title={t.users[currentLang]}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.name[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.role[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.permissions[currentLang]}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.actions[currentLang]}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img className="h-8 w-8 rounded-full mr-3 bg-slate-200 object-cover" src={u.avatar} alt="" />
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
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {u.role === UserRole.ADMIN ? 'Full Access' : (u.permissions.length > 0 ? u.permissions.join(', ') : 'No specific access')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => handleEditClick(u)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                        <Edit3 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Clean Slate / Borrón Zone */}
      {/* Only visible if Admin, though Users page is technically protected */}
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
