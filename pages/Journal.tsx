import React, { useState } from 'react';
import { Card } from '../components/Card';
import { MOCK_JOURNAL, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Plus, Filter, Download } from 'lucide-react';
import { Button } from '../components/Button';

export const Journal: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const t = TRANSLATIONS;
  const [filter, setFilter] = useState('');

  const filteredData = MOCK_JOURNAL.filter(j => 
    j.description.toLowerCase().includes(filter.toLowerCase()) || 
    j.account.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.journal_entries[currentLang]}</h1>
          <p className="text-slate-500 text-sm">General Ledger (GL)</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={<Download size={16} />}>Export</Button>
          <Button size="sm" icon={<Plus size={16} />}>New Entry</Button>
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
    </div>
  );
};