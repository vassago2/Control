import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  currentLang: Language;
}

const data = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <span className={`text-xs font-medium mt-2 inline-flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {Math.abs(trend)}% vs last month
      </span>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ currentLang }) => {
  const t = TRANSLATIONS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.dashboard[currentLang]}</h1>
        <p className="text-slate-500 text-sm">Resumen financiero en tiempo real</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t.revenue[currentLang]} 
          value="€124,500.00" 
          trend={12.5} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title={t.expenses[currentLang]} 
          value="€82,100.00" 
          trend={-2.4} 
          icon={Activity} 
          color="bg-red-500" 
        />
        <StatCard 
          title={t.net_profit[currentLang]} 
          value="€42,400.00" 
          trend={8.1} 
          icon={TrendingUp} 
          color="bg-indigo-500" 
        />
      </div>

      {/* Main Chart */}
      <Card title="Cash Flow (YTD)" className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#6366f1" fill="#818cf8" fillOpacity={0.2} />
            <Area type="monotone" dataKey="expense" stackId="2" stroke="#ef4444" fill="#f87171" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activity Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t.pending_reconciliations[currentLang]}>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                 <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                   <div>
                     <p className="text-sm font-medium text-slate-900">Santander - Oct {i}</p>
                     <p className="text-xs text-slate-500">Unreconciled items: {i * 2}</p>
                   </div>
                 </div>
                 <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Review</button>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Quick Actions">
           <div className="grid grid-cols-2 gap-4">
             <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-indigo-100">
                  <DollarSign size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700">New Invoice</span>
             </button>
             <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2 group-hover:bg-green-100">
                  <Activity size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700">Record Expense</span>
             </button>
           </div>
        </Card>
      </div>
    </div>
  );
};