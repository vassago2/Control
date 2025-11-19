
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { TRANSLATIONS } from '../constants';
import { Language, JournalEntry } from '../types';
import { Plus, Filter, Download, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';

interface JournalProps {
  currentLang: Language;
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
}

export const Journal: React.FC<JournalProps> = ({ currentLang, entries, setEntries }) => {
  const t = TRANSLATIONS;
  const [filter, setFilter] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntryDesc, setNewEntryDesc] = useState('');
  
  // Using a temporary structure for the form lines
  interface FormLine {
    id: number;
    account: string;
    debit: string; // String to allow empty inputs
    credit: string;
  }
  
  const [lines, setLines] = useState<FormLine[]>([
    { id: 1, account: '', debit: '', credit: '' },
    { id: 2, account: '', debit: '', credit: '' }
  ]);

  const filteredData = entries.filter(j => 
    j.description.toLowerCase().includes(filter.toLowerCase()) || 
    j.account.toLowerCase().includes(filter.toLowerCase())
  );

  // Calculations
  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  const difference = totalDebit - totalCredit;
  const isBalanced = Math.abs(difference) < 0.01;

  const handleOpenModal = () => {
    setNewEntryDate(new Date().toISOString().split('T')[0]);
    setNewEntryDesc('');
    setLines([
        { id: 1, account: '', debit: '', credit: '' },
        { id: 2, account: '', debit: '', credit: '' }
    ]);
    setIsModalOpen(true);
  };

  const handleAddLine = () => {
    setLines([...lines, { id: Date.now(), account: '', debit: '', credit: '' }]);
  };

  const handleRemoveLine = (id: number) => {
    if (lines.length > 2) {
      setLines(lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: number, field: keyof FormLine, value: string) => {
    setLines(lines.map(line => {
        if (line.id === id) {
            return { ...line, [field]: value };
        }
        return line;
    }));
  };

  const handleSave = () => {
    if (!isBalanced) return;
    if (!newEntryDesc) {
        alert('Please enter a description');
        return;
    }

    const newEntries: JournalEntry[] = lines
        .filter(l => l.account && (parseFloat(l.debit) || parseFloat(l.credit)))
        .map((line, index) => ({
            id: `J${Date.now()}-${index}`,
            date: newEntryDate,
            description: newEntryDesc,
            account: line.account,
            debit: parseFloat(line.debit) || 0,
            credit: parseFloat(line.credit) || 0,
            status: 'posted'
        }));

    if (newEntries.length === 0) return;

    setEntries([...newEntries, ...entries]); // Add new entries to top
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.journal_entries[currentLang]}</h1>
          <p className="text-slate-500 text-sm">General Ledger (GL)</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={<Download size={16} />}>Export</Button>
          <Button size="sm" icon={<Plus size={16} />} onClick={handleOpenModal}>{t.new_entry[currentLang]}</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter transactions..." 
              className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.date[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.account[currentLang]}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.description[currentLang]}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.debit[currentLang]}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.credit[currentLang]}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">{t.status[currentLang]}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{entry.account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{entry.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-mono">
                    {entry.debit > 0 ? `€${entry.debit.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-mono">
                    {entry.credit > 0 ? `€${entry.credit.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 uppercase">
                       {entry.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-slate-800">{t.new_entry[currentLang]}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Global Entry Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.date[currentLang]}</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={newEntryDate}
                                onChange={(e) => setNewEntryDate(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.description[currentLang]}</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                placeholder="e.g. Monthly Office Rent"
                                value={newEntryDesc}
                                onChange={(e) => setNewEntryDesc(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Lines Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase w-1/2">{t.account[currentLang]}</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase w-1/6">{t.debit[currentLang]}</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase w-1/6">{t.credit[currentLang]}</th>
                                    <th className="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {lines.map((line) => (
                                    <tr key={line.id}>
                                        <td className="p-2">
                                            <input 
                                                type="text" 
                                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                                placeholder="e.g. 5720 Banco"
                                                value={line.account}
                                                onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-right font-mono"
                                                placeholder="0.00"
                                                value={line.debit}
                                                onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-right font-mono"
                                                placeholder="0.00"
                                                value={line.credit}
                                                onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            <button 
                                                onClick={() => handleRemoveLine(line.id)}
                                                className="text-slate-400 hover:text-red-500 disabled:opacity-30"
                                                disabled={lines.length <= 2}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-2 bg-slate-50 border-t border-slate-200">
                            <Button size="sm" variant="secondary" onClick={handleAddLine} icon={<Plus size={14} />}>
                                {t.add_line[currentLang]}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer / Totals */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-8 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">{t.total_debit[currentLang]}</p>
                                <p className="font-mono font-bold text-slate-900 text-lg">€{totalDebit.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">{t.total_credit[currentLang]}</p>
                                <p className="font-mono font-bold text-slate-900 text-lg">€{totalCredit.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">{t.imbalance[currentLang]}</p>
                                <p className={`font-mono font-bold text-lg ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                                    €{Math.abs(difference).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isBalanced && (
                                <span className="flex items-center text-red-600 text-sm font-medium">
                                    <AlertTriangle size={16} className="mr-2" />
                                    {t.must_balance[currentLang]}
                                </span>
                            )}
                            <Button 
                                disabled={!isBalanced} 
                                onClick={handleSave}
                                icon={<Save size={16} />}
                            >
                                {t.post_entry[currentLang]}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
