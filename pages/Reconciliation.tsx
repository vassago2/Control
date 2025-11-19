import React, { useState } from 'react';
import { Card } from '../components/Card';
import { MOCK_BANK_TX, MOCK_JOURNAL, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Check, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const Reconciliation: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const t = TRANSLATIONS;
  const [selectedBankTx, setSelectedBankTx] = useState<string | null>(null);
  const [selectedLedgerTx, setSelectedLedgerTx] = useState<string | null>(null);
  const [reconciledIds, setReconciledIds] = useState<string[]>([]);

  // Mock ledger items that are relevant for bank
  const ledgerItems = MOCK_JOURNAL.filter(j => j.account.includes('5720') || j.account.includes('7000'));

  const handleMatch = () => {
    if (selectedBankTx && selectedLedgerTx) {
      setReconciledIds([...reconciledIds, selectedBankTx, selectedLedgerTx]);
      setSelectedBankTx(null);
      setSelectedLedgerTx(null);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.reconciliation[currentLang]}</h1>
          <p className="text-slate-500 text-sm">Banco Santander - ES98 2000...</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase">Unreconciled Balance</p>
          <p className="text-xl font-mono font-bold text-red-600">-€1,350.00</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Left: Bank Feed */}
        <div className="md:col-span-5 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 border-l-4 border-l-indigo-500">
            <div className="p-4 border-b border-slate-200 bg-indigo-50 flex justify-between items-center">
              <h3 className="font-semibold text-indigo-900">{t.bank_feed[currentLang]}</h3>
            </div>
            <div className="overflow-y-auto p-2 space-y-2 flex-1">
              {MOCK_BANK_TX.filter(tx => !reconciledIds.includes(tx.id) && !tx.matched).map(tx => (
                <div 
                  key={tx.id}
                  onClick={() => setSelectedBankTx(tx.id === selectedBankTx ? null : tx.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBankTx === tx.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-500">{tx.date}</span>
                    <span className={`font-mono text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {tx.amount} €
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 truncate">{tx.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: Actions */}
        <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <ArrowRightLeft className="text-slate-400" size={24} />
          </div>
          <Button 
            disabled={!selectedBankTx || !selectedLedgerTx}
            onClick={handleMatch}
            className="w-full"
            icon={<Check size={16} />}
          >
            {t.match[currentLang]}
          </Button>
          <p className="text-xs text-center text-slate-400 px-4">
            Select one item from each side to reconcile manually.
          </p>
        </div>

        {/* Right: Ledger */}
        <div className="md:col-span-5 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 border-l-4 border-l-green-500">
            <div className="p-4 border-b border-slate-200 bg-green-50 flex justify-between items-center">
              <h3 className="font-semibold text-green-900">{t.ledger[currentLang]}</h3>
            </div>
             <div className="overflow-y-auto p-2 space-y-2 flex-1">
              {ledgerItems.filter(tx => !reconciledIds.includes(tx.id)).map(tx => {
                const amount = tx.debit > 0 ? -tx.debit : tx.credit; // Simplifying for demo logic
                return (
                  <div 
                    key={tx.id}
                    onClick={() => setSelectedLedgerTx(tx.id === selectedLedgerTx ? null : tx.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedLedgerTx === tx.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300'
                    }`}
                  >
                     <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-500">{tx.date}</span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {amount > 0 ? amount : (tx.debit > 0 ? -tx.debit : tx.credit)} €
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 truncate">{tx.description}</p>
                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{tx.account}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};