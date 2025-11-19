
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Journal } from './pages/Journal';
import { Reconciliation } from './pages/Reconciliation';
import { Users } from './pages/Users';
import { ClientsVendors } from './pages/ClientsVendors';
import { AccessDenied } from './pages/AccessDenied';
import { User, Language, UserRole, JournalEntry, ClientVendor } from './types';
import { MOCK_USERS, MOCK_JOURNAL, MOCK_CLIENTS_VENDORS } from './constants';

// Helper component for Role/Permission protected routes
const ProtectedRoute = ({ 
  user, 
  permission, 
  children 
}: { 
  user: User; 
  permission?: string; 
  children: React.ReactElement 
}) => {
  if (!user) return <Navigate to="/login" replace />;

  // Admin always has access
  if (user.role === UserRole.ADMIN || (user.permissions && user.permissions.includes('*'))) {
    return children;
  }

  // Check specific permission
  if (permission && !user.permissions.includes(permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [loading, setLoading] = useState(true);

  // Global State lifted from pages
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL);
  const [clientsVendors, setClientsVendors] = useState<ClientVendor[]>(MOCK_CLIENTS_VENDORS);

  // Simulate session check
  useEffect(() => {
    const savedUser = localStorage.getItem('finanza_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (u: string, p: string) => {
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let foundUser: User | undefined;

    if (u === 'Tony' && p === 'Barros') {
      foundUser = MOCK_USERS.find(mu => mu.role === UserRole.ADMIN);
    } else if (u === 'hans') {
      foundUser = MOCK_USERS.find(mu => mu.role === UserRole.MANAGER);
    } else if (u === 'ana') {
      foundUser = MOCK_USERS.find(mu => mu.role === UserRole.OFFICE);
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('finanza_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('finanza_user');
  };

  const handleAddJournalEntries = (newEntries: JournalEntry[]) => {
    setJournalEntries(prev => [...newEntries, ...prev]);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600">Loading...</div>;

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} currentLang={language} />} />
        </Routes>
      ) : (
        <Layout 
          user={user} 
          currentLang={language} 
          onLogout={handleLogout}
          onLanguageChange={setLanguage}
        >
          <Routes>
            <Route path="/" element={
                <ProtectedRoute user={user} permission="dashboard:read">
                    <Dashboard currentLang={language} />
                </ProtectedRoute>
            } />
            
            <Route path="/accounting" element={
                <ProtectedRoute user={user} permission="accounting:read">
                    <Journal 
                      currentLang={language} 
                      entries={journalEntries}
                      setEntries={setJournalEntries}
                    />
                </ProtectedRoute>
            } />

            <Route path="/reconciliation" element={
                <ProtectedRoute user={user} permission="accounting:read">
                    <Reconciliation currentLang={language} />
                </ProtectedRoute>
            } />

            <Route path="/clients-vendors" element={
                <ProtectedRoute user={user} permission="crm:read">
                    <ClientsVendors 
                      currentLang={language}
                      entities={clientsVendors}
                      setEntities={setClientsVendors}
                      onAddJournalEntry={handleAddJournalEntries}
                    />
                </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute user={user} permission="users:read">
                 <Users currentLang={language} /> 
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
                <ProtectedRoute user={user} permission="users:read">
                    <Users currentLang={language} />
                </ProtectedRoute>
            } />

            <Route path="/access-denied" element={<AccessDenied currentLang={language} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}
