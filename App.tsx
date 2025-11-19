import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Journal } from './pages/Journal';
import { Reconciliation } from './pages/Reconciliation';
import { Users } from './pages/Users';
import { User, Language, UserRole } from './types';
import { MOCK_USERS } from './constants';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [loading, setLoading] = useState(true);

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
    
    if (u === 'Tony' && p === 'Barros') {
      // Use the Admin mock user
      const adminUser = MOCK_USERS.find(mu => mu.role === UserRole.ADMIN);
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem('finanza_user', JSON.stringify(adminUser));
      }
    } else if (u === 'hans') {
        // Demo manager
        setUser(MOCK_USERS[1]);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('finanza_user');
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
            <Route path="/" element={<Dashboard currentLang={language} />} />
            <Route path="/accounting" element={<Journal currentLang={language} />} />
            <Route path="/reconciliation" element={<Reconciliation currentLang={language} />} />
            
            {/* RBAC Protected Route */}
            <Route path="/users" element={
              user.role === UserRole.ADMIN 
                ? <Users currentLang={language} /> 
                : <Navigate to="/" replace />
            } />
            
            <Route path="/settings" element={
                user.role === UserRole.ADMIN 
                ? <Users currentLang={language} /> // Reuse Users for settings demo
                : <Navigate to="/" replace />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}