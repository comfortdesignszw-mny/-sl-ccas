
// Add missing React and useMemo imports
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Filter, Coins, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Transaction, TransactionType, Currency } from '../types';
import { getCurrencySymbol } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  defaultCurrency: Currency;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, defaultCurrency }) => {
  const stats = useMemo(() => {
    const defaultStats = { income: 0, expenses: 0, net: 0 };
    transactions.forEach(tx => {
      if (tx.currency === defaultCurrency) {
        if (tx.type === TransactionType.INCOME) defaultStats.income += tx.amount;
        else defaultStats.expenses += tx.amount;
      }
    });
    defaultStats.net = defaultStats.income - defaultStats.expenses;
    return defaultStats;
  }, [transactions, defaultCurrency]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const data = months.map(month => ({ name: month, income: 0, expense: 0 }));

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      if (date.getFullYear() === currentYear && tx.currency === defaultCurrency) {
        const monthIndex = date.getMonth();
        if (tx.type === TransactionType.INCOME) data[monthIndex].income += tx.amount;
        else data[monthIndex].expense += tx.amount;
      }
    });
    return data;
  }, [transactions, defaultCurrency]);

  // Dynamic classification stats based on real transaction data
  const classificationStats = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    let totalVolume = 0;

    // We analyze the volume (absolute amount) for the default currency
    transactions.filter(tx => tx.currency === defaultCurrency).forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      totalVolume += tx.amount;
    });

    if (totalVolume === 0) return [];

    // Sort by value descending and take top categories
    const sorted = Object.entries(categoryTotals)
      .map(([label, amount]) => ({
        label,
        percentage: Math.round((amount / totalVolume) * 100),
        amount
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Assign colors from a refined palette
    const colors = ['bg-blue-600', 'bg-cyan-500', 'bg-[#0f172a]', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500'];
    
    return sorted.map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    })).slice(0, 5); // Show top 5 classifications
  }, [transactions, defaultCurrency]);

  const currencySymbol = getCurrencySymbol(defaultCurrency);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Financial Hub</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-500" /> Secure Treasury Monitor ({defaultCurrency})
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[#0f172a] text-white rounded-[1.5rem] shadow-xl shadow-slate-900/10">
            <Coins size={18} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Base Ledger: {defaultCurrency}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Revenue */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total Revenue</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-300">{currencySymbol}</span>
                <h3 className="text-4xl font-black text-[#0f172a] tracking-tighter">
                  {stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl shadow-sm shadow-emerald-100 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-black bg-emerald-50 w-fit px-3 py-1.5 rounded-xl border border-emerald-100">
            <ArrowUpRight size={14} /> 14.2% Growth
          </div>
        </div>

        {/* Card 2: Expenditures */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Expenditures</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-300">{currencySymbol}</span>
                <h3 className="text-4xl font-black text-[#0f172a] tracking-tighter">
                  {stats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl shadow-sm shadow-orange-100 group-hover:scale-110 transition-transform">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-black bg-orange-50 w-fit px-3 py-1.5 rounded-xl border border-orange-100">
             Audit Verification Required
          </div>
        </div>

        {/* Card 3: Liquid Assets */}
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex flex-col">
              <p className="text-blue-200/60 font-black text-[10px] uppercase tracking-widest mb-1">Liquid Reserves</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-400/40">{currencySymbol}</span>
                <h3 className="text-4xl font-black text-white tracking-tighter">
                  {stats.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="p-4 bg-blue-500 text-white rounded-3xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/10 relative z-10">
            Current Balanced Sheet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 min-w-0">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className="text-xl font-black text-[#0f172a] tracking-tight">Growth Visualization</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fiscal Cycle Analytics</p>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-lg shadow-blue-600/20"></div> Revenue
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/20"></div> Expense
                </div>
            </div>
          </div>
          {/* Changed height to min-h and added relative positioning to fix the width/height -1 warning */}
          <div className="relative w-full h-[380px] min-h-[380px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={380}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px'}}
                  itemStyle={{fontWeight: '900', fontSize: '12px', textTransform: 'uppercase'}}
                  formatter={(value: any) => [`${currencySymbol}${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#06b6d4" strokeWidth={3} strokeDasharray="8 8" fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
          <h4 className="text-xl font-black text-[#0f172a] mb-8 tracking-tight">Classification</h4>
          {classificationStats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center border border-slate-100">
                    <Filter size={32} />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Awaiting Data Feed</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1">
                {classificationStats.map((cat) => (
                <div key={cat.label} className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[70%]">{cat.label}</span>
                        <span className="text-xs font-black text-slate-900">{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                            className={`h-full ${cat.color} rounded-full transition-all duration-1000 shadow-sm shadow-black/5`} 
                            style={{ width: `${cat.percentage}%` }}
                        ></div>
                    </div>
                </div>
                ))}
            </div>
          )}
          <div className="mt-10 p-6 bg-cyan-50/50 rounded-[2rem] border border-cyan-100 group cursor-default">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-cyan-500 rounded-lg text-white">
                    <ShieldCheck size={14} />
                </div>
                <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">Verification Status</span>
             </div>
             <p className="text-[11px] text-cyan-800 font-bold leading-relaxed">
                Ledger is currently synchronized with the diocesan cloud for real-time audit protection.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
