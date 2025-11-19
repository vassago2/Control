
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Language, ClientVendor, JournalEntry } from '../types';
import { TRANSLATIONS } from '../constants';
import { Plus, Search, Building2, ShoppingBag, AlertCircle, X, Save, Trash2, Edit3, FileText, History, CreditCard, CheckCircle } from 'lucide-react';

interface ClientsVendorsProps {
    currentLang: Language;
    entities: ClientVendor[];
    setEntities: (e: ClientVendor[]) => void;
    onAddJournalEntry: (entries: JournalEntry[]) => void;
}

export const ClientsVendors: React.FC<ClientsVendorsProps> = ({ currentLang, entities, setEntities, onAddJournalEntry }) => {
  const t = TRANSLATIONS;
  const [activeTab, setActiveTab] = useState<'client' | 'vendor'>('client');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'invoices' | 'history'>('details');
  
  const [formData, setFormData] = useState<Partial<ClientVendor>>({
    name: '',
    email: '',
    vatNumber: '',
    paymentTerms: 'Net 30',
    currency: 'EUR'
  });

  // Invoice creation state
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvDate, setNewInvDate] = useState('');

  const filteredEntities = entities.filter(e => 
    e.type === activeTab && 
    (e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.vatNumber.includes(searchTerm))
  );

  // Calculation helpers
  const getTotalBalance = () => filteredEntities.reduce((acc, curr) => acc + curr.balance, 0);
  const getOverdueCount = () => filteredEntities.reduce((acc, curr) => 
    acc + curr.outstandingInvoices.filter(inv => inv.status === 'overdue').length, 0
  );

  // Handlers
  const handleOpenModal = (entity?: ClientVendor) => {
    setModalTab('details');
    setShowInvoiceForm(false);
    if (entity) {
      setIsEditing(entity.id);
      setFormData({
        name: entity.name,
        email: entity.email,
        vatNumber: entity.vatNumber,
        paymentTerms: entity.paymentTerms,
        currency: entity.currency
      });
    } else {
      setIsEditing(null);
      setFormData({
        name: '',
        email: '',
        vatNumber: '',
        paymentTerms: 'Net 30',
        currency: 'EUR'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.vatNumber) {
      alert("Name and VAT Number are required");
      return;
    }

    if (isEditing) {
      setEntities(entities.map(e => e.id === isEditing ? { ...e, ...formData } as ClientVendor : e));
    } else {
      const newEntity: ClientVendor = {
        id: `${activeTab.charAt(0).toUpperCase()}${Date.now()}`,
        type: activeTab,
        balance: 0,
        outstandingInvoices: [],
        paymentHistory: [],
        name: formData.name!,
        email: formData.email!,
        vatNumber: formData.vatNumber!,
        paymentTerms: formData.paymentTerms!,
        currency: formData.currency || 'EUR'
      };
      setEntities([...entities, newEntity]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirm_delete[currentLang])) {
      setEntities(entities.filter(e => e.id !== id));
    }
  };

  const handleCreateInvoice = () => {
    if(!newInvAmount || !newInvDate || !isEditing) return;
    const amount = parseFloat(newInvAmount);
    const invId = `INV-${Date.now()}`;
    
    // 1. Create Invoice in Entity
    const updatedEntities = entities.map(e => {
        if(e.id === isEditing) {
            return {
                ...e,
                balance: e.balance + amount,
                outstandingInvoices: [...e.outstandingInvoices, {
                    id: invId,
                    amount: amount,
                    dueDate: newInvDate,
                    status: 'pending'
                }]
            } as ClientVendor;
        }
        return e;
    });
    setEntities(updatedEntities);

    // 2. Generate Journal Entry
    // Logic: 
    // If Client: Dr Accounts Receivable (4300) / Cr Sales (7000) + Cr VAT (4770)
    // If Vendor: Dr Expenses (6000) + Dr VAT (4720) / Cr Accounts Payable (4100)
    const taxRate = 0.21;
    const base = amount / (1 + taxRate);
    const tax = amount - base;

    const journalDate = new Date().toISOString().split('T')[0];
    const description = `${activeTab === 'client' ? 'Invoice' : 'Bill'} #${invId} - ${formData.name}`;
    
    const newEntries: JournalEntry[] = [];
    
    if(activeTab === 'client') {
        newEntries.push(
            { id: `GEN-${Date.now()}-1`, date: journalDate, description: description, account: '4300 Clientes', debit: amount, credit: 0, status: 'posted' },
            { id: `GEN-${Date.now()}-2`, date: journalDate, description: description, account: '7000 Ventas', debit: 0, credit: base, status: 'posted' },
            { id: `GEN-${Date.now()}-3`, date: journalDate, description: description, account: '4770 HP IVA Repercutido', debit: 0, credit: tax, status: 'posted' }
        );
    } else {
        newEntries.push(
            { id: `GEN-${Date.now()}-1`, date: journalDate, description: description, account: '6000 Compras', debit: base, credit: 0, status: 'posted' },
            { id: `GEN-${Date.now()}-2`, date: journalDate, description: description, account: '4720 HP IVA Soportado', debit: tax, credit: 0, status: 'posted' },
            { id: `GEN-${Date.now()}-3`, date: journalDate, description: description, account: '4100 Acreedores', debit: 0, credit: amount, status: 'posted' }
        );
    }
    
    onAddJournalEntry(newEntries);

    // Reset
    setNewInvAmount('');
    setNewInvDate('');
    setShowInvoiceForm(false);
  };

  const handlePayInvoice = (invId: string, amount: number) => {
    if(!isEditing) return;
    const payId = `PAY-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    // 1. Move invoice to history in Entity
    const updatedEntities = entities.map(e => {
        if(e.id === isEditing) {
            const inv = e.outstandingInvoices.find(i => i.id === invId);
            if(!inv) return e;
            
            return {
                ...e,
                balance: e.balance - amount,
                outstandingInvoices: e.outstandingInvoices.filter(i => i.id !== invId),
                paymentHistory: [...(e.paymentHistory || []), {
                    id: payId,
                    date: today,
                    amount: amount,
                    method: 'Bank Transfer',
                    reference: invId
                }]
            } as ClientVendor;
        }
        return e;
    });
    setEntities(updatedEntities);

    // 2. Generate Journal Entry
    // Client Pay: Dr Bank (5720) / Cr Client (4300)
    // Vendor Pay: Dr Vendor (4100) / Cr Bank (5720)
    const description = `Payment for ${invId} - ${formData.name}`;
    const newEntries: JournalEntry[] = [];

    if(activeTab === 'client') {
        newEntries.push(
            { id: `PAY-${Date.now()}-1`, date: today, description, account: '5720 Banco', debit: amount, credit: 0, status: 'posted' },
            { id: `PAY-${Date.now()}-2`, date: today, description, account: '4300 Clientes', debit: 0, credit: amount, status: 'posted' }
        );
    } else {
         newEntries.push(
            { id: `PAY-${Date.now()}-1`, date: today, description, account: '4100 Acreedores', debit: amount, credit: 0, status: 'posted' },
            { id: `PAY-${Date.now()}-2`, date: today, description, account: '5720 Banco', debit: 0, credit: amount, status: 'posted' }
        );
    }

    onAddJournalEntry(newEntries);
  };

  const currentEntity = entities.find(e => e.id === isEditing);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.clients_vendors[currentLang]}</h1>
          <p className="text-slate-500 text-sm">CRM & SRM Management</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => handleOpenModal()}>
            {activeTab === 'client' ? t.add_client[currentLang] : t.add_vendor[currentLang]}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('client')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'client'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ShoppingBag size={18} className="mr-2" />
            {t.clients[currentLang]}
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'vendor'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Building2 size={18} className="mr-2" />
            {t.vendors[currentLang]}
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-50 border-none">
            <p className="text-sm text-slate-500">Total {activeTab === 'client' ? 'Receivables' : 'Payables'}</p>
            <p className={`text-2xl font-bold ${activeTab === 'client' ? 'text-green-600' : 'text-red-600'}`}>
                €{getTotalBalance().toFixed(2)}
            </p>
        </Card>
        <Card className="bg-slate-50 border-none">
            <p className="text-sm text-slate-500">Overdue Invoices</p>
            <p className="text-2xl font-bold text-orange-600">{getOverdueCount()}</p>
        </Card>
      </div>

      <Card>
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or VAT ID..." 
              className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.name[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.vat_number[currentLang]}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.balance_due[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider pl-8">Outstanding</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.payment_terms[currentLang]}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.actions[currentLang]}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredEntities.map((entity) => (
                <tr 
                    key={entity.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => handleOpenModal(entity)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{entity.name}</div>
                    <div className="text-xs text-slate-500">{entity.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {entity.vatNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-mono font-bold ${
                        entity.balance > 0 
                        ? (entity.type === 'client' ? 'text-green-600' : 'text-red-600') 
                        : 'text-slate-400'
                    }`}>
                       €{entity.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                        {entity.outstandingInvoices.length === 0 && <span className="text-xs text-slate-400 italic">Settled</span>}
                        {entity.outstandingInvoices.map(inv => (
                            <div key={inv.id} className="flex items-center text-xs">
                                {inv.status === 'overdue' && <AlertCircle size={12} className="text-red-500 mr-1" />}
                                <span className={`font-mono ${inv.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
                                    {inv.id}: €{inv.amount}
                                </span>
                                <span className="text-slate-400 ml-2 text-[10px]">Due {inv.dueDate}</span>
                            </div>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        {entity.paymentTerms}
                     </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(entity); }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(entity.id); }}
                        className="text-red-400 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEntities.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                          No {activeTab}s found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditing ? formData.name : (activeTab === 'client' ? t.add_client[currentLang] : t.add_vendor[currentLang])}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Tabs inside Modal */}
            {isEditing && (
                <div className="px-6 pt-2 border-b border-slate-100 flex space-x-4">
                    <button 
                        onClick={() => setModalTab('details')}
                        className={`pb-2 text-sm font-medium border-b-2 ${modalTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500'}`}
                    >
                        {t.details[currentLang]}
                    </button>
                    <button 
                        onClick={() => setModalTab('invoices')}
                        className={`pb-2 text-sm font-medium border-b-2 ${modalTab === 'invoices' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500'}`}
                    >
                        {t.invoices[currentLang]}
                    </button>
                    <button 
                        onClick={() => setModalTab('history')}
                        className={`pb-2 text-sm font-medium border-b-2 ${modalTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500'}`}
                    >
                        {t.payment_history[currentLang]}
                    </button>
                </div>
            )}
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* TAB: DETAILS */}
              {modalTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.name[currentLang]} *</label>
                        <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Acme Corp"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.vat_number[currentLang]} *</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={formData.vatNumber}
                            onChange={e => setFormData({...formData, vatNumber: e.target.value})}
                            placeholder="B12345678"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.payment_terms[currentLang]}</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={formData.paymentTerms}
                            onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                        >
                            <option value="Immediate">Immediate</option>
                            <option value="Net 15">Net 15</option>
                            <option value="Net 30">Net 30</option>
                            <option value="Net 60">Net 60</option>
                        </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.email[currentLang]}</label>
                        <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="billing@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.currency[currentLang]}</label>
                        <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                        >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                  </div>
              )}

              {/* TAB: INVOICES */}
              {modalTab === 'invoices' && currentEntity && (
                  <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-bold text-slate-700">Outstanding Items</h4>
                          {!showInvoiceForm && (
                             <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={() => setShowInvoiceForm(true)}>
                                 {t.create_invoice[currentLang]}
                             </Button>
                          )}
                      </div>

                      {showInvoiceForm && (
                          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                      <label className="text-xs font-semibold text-indigo-800 uppercase">{t.amount[currentLang]}</label>
                                      <input type="number" value={newInvAmount} onChange={e=>setNewInvAmount(e.target.value)} className="w-full p-2 rounded border border-indigo-200 text-sm" />
                                  </div>
                                  <div>
                                      <label className="text-xs font-semibold text-indigo-800 uppercase">{t.due_date[currentLang]}</label>
                                      <input type="date" value={newInvDate} onChange={e=>setNewInvDate(e.target.value)} className="w-full p-2 rounded border border-indigo-200 text-sm" />
                                  </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="outline" onClick={() => setShowInvoiceForm(false)}>Cancel</Button>
                                  <Button size="sm" onClick={handleCreateInvoice}>Create & Post to GL</Button>
                              </div>
                          </div>
                      )}

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                  <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Ref</th>
                                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">{t.amount[currentLang]}</th>
                                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">{t.due_date[currentLang]}</th>
                                      <th className="px-4 py-2 w-16"></th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                  {currentEntity.outstandingInvoices.map(inv => (
                                      <tr key={inv.id}>
                                          <td className="px-4 py-2 text-sm font-mono text-slate-600">{inv.id}</td>
                                          <td className="px-4 py-2 text-right text-sm font-bold text-slate-800">€{inv.amount.toFixed(2)}</td>
                                          <td className="px-4 py-2 text-right text-sm text-slate-500">{inv.dueDate}</td>
                                          <td className="px-4 py-2 text-center">
                                              <button 
                                                title="Mark as Paid"
                                                className="text-green-600 hover:text-green-800"
                                                onClick={() => handlePayInvoice(inv.id, inv.amount)}
                                              >
                                                  <CheckCircle size={18} />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  {currentEntity.outstandingInvoices.length === 0 && (
                                      <tr><td colSpan={4} className="p-4 text-center text-xs text-slate-400">No outstanding invoices.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* TAB: HISTORY */}
              {modalTab === 'history' && currentEntity && (
                  <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                  <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{t.date[currentLang]}</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{t.method[currentLang]}</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Ref</th>
                                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">{t.amount[currentLang]}</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                  {(currentEntity.paymentHistory || []).map(pay => (
                                      <tr key={pay.id}>
                                          <td className="px-4 py-2 text-sm text-slate-600">{pay.date}</td>
                                          <td className="px-4 py-2 text-sm text-slate-600">{pay.method}</td>
                                          <td className="px-4 py-2 text-sm font-mono text-slate-500 text-xs">{pay.reference}</td>
                                          <td className="px-4 py-2 text-right text-sm font-bold text-slate-800">€{pay.amount.toFixed(2)}</td>
                                      </tr>
                                  ))}
                                   {(currentEntity.paymentHistory || []).length === 0 && (
                                      <tr><td colSpan={4} className="p-4 text-center text-xs text-slate-400">No payment history found.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                {t.cancel[currentLang]}
              </Button>
              <Button onClick={handleSave} icon={<Save size={16} />}>
                {t.save[currentLang]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
