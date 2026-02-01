
import React, { useState } from 'react';
import { Filter, Download, Search, Edit2, Calendar, Tag, CreditCard, Coins, ChevronRight, LayoutGrid, CheckCircle2, ShieldCheck, X, Receipt, FileCheck } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus, Currency } from '../types';
import { getCurrencySymbol } from '../constants';

interface TransactionsProps {
  transactions: Transaction[];
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onUpdate }) => {
  const [filter, setFilter] = useState('');
  const [approvalTarget, setApprovalTarget] = useState<Transaction | null>(null);
  const [referenceInput, setReferenceInput] = useState('');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const filtered = transactions.filter(t => 
    t.category.toLowerCase().includes(filter.toLowerCase()) ||
    t.description.toLowerCase().includes(filter.toLowerCase()) ||
    t.method.toLowerCase().includes(filter.toLowerCase()) ||
    t.currency.toLowerCase().includes(filter.toLowerCase())
  );

  const handleApprove = () => {
    if (approvalTarget && referenceInput.trim()) {
      onUpdate(approvalTarget.id, {
        status: TransactionStatus.APPROVED,
        referenceNumber: referenceInput.trim()
      });
      setApprovalTarget(null);
      setReferenceInput('');
    }
  };

  const handleBatchApprove = () => {
    if (!referenceInput.trim()) return;
    
    const pendingTransactions = filtered.filter(tx => tx.status === TransactionStatus.PENDING);
    pendingTransactions.forEach(tx => {
      onUpdate(tx.id, {
        status: TransactionStatus.APPROVED,
        referenceNumber: `${referenceInput.trim()} (Batch)`
      });
    });
    
    setIsBatchModalOpen(false);
    setReferenceInput('');
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = [
      'ID', 'Date', 'Type', 'Category', 'Method', 'Amount', 'Currency', 'Status', 'Description', 'Reference'
    ];

    const rows = filtered.map(tx => [
      tx.id,
      tx.date,
      tx.type,
      `"${tx.category.replace(/"/g, '""')}"`,
      tx.method,
      tx.amount,
      tx.currency,
      tx.status,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      `"${(tx.referenceNumber || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CCAS_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Ledger Overview</h2>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Total Entries: {filtered.length}
          </p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
                <Download size={16} className="text-cyan-500" /> Export CSV
            </button>
            <button 
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10 active:scale-95"
            >
                <LayoutGrid size={16} /> Batch Action
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Search specifically for categories, methods or remarks..." 
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-cyan-200 focus:ring-8 focus:ring-cyan-50 outline-none transition-all text-sm font-bold placeholder:text-slate-300 text-slate-900"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <select className="bg-slate-50 border border-transparent rounded-2xl text-xs font-black text-slate-600 px-6 py-4 outline-none flex-1 md:flex-none appearance-none hover:bg-slate-100 transition-colors">
                <option>ALL FLOWS</option>
                <option>INCOME ONLY</option>
                <option>EXPENDITURE ONLY</option>
            </select>
            <button className="p-4 bg-slate-50 border border-transparent text-slate-400 rounded-2xl hover:text-cyan-600 hover:bg-cyan-50 transition-all">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f172a] text-white">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Chronology & Meta</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Category System</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Unit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-right">Value</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                        <div className="max-w-xs mx-auto space-y-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
                                <Search size={40} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-black text-[#0f172a]">The ledger is quiet</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No entries match your parameters</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-cyan-500">
                    <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-lg font-black text-slate-800 leading-none">{new Date(tx.date).getDate()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-[#0f172a] group-hover:text-blue-600 transition-colors leading-tight">{tx.description || 'No memo attached'}</span>
                                {tx.referenceNumber && (
                                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                                     Ref: {tx.referenceNumber}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                    <Calendar size={10} className="text-cyan-500" /> {new Date(tx.date).getFullYear()}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${tx.type === TransactionType.INCOME ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{tx.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard size={12} className="text-slate-300" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.method}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                            <Coins size={12} className="text-cyan-500" />
                            <span className="text-[10px] font-black text-slate-700">{tx.currency}</span>
                        </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                        <div className="flex flex-col items-end">
                            <span className={`text-lg font-black tracking-tight ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-[#0f172a]'}`}>
                                {tx.type === TransactionType.INCOME ? '+' : '-'}{getCurrencySymbol(tx.currency)}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Verified Balance</span>
                        </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                            {tx.status === TransactionStatus.PENDING ? (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setApprovalTarget(tx);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-cyan-500 text-white border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all active:scale-95"
                              >
                                <ShieldCheck size={14} /> Approve
                              </button>
                            ) : (
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                                  tx.status === TransactionStatus.APPROVED ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100' : 
                                  tx.status === TransactionStatus.VERIFIED ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100' : 
                                  'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100'
                              }`}>
                                  {tx.status}
                              </span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all" title="Edit Entry">
                                  <Edit2 size={18} />
                              </button>
                              <button className="p-3 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-all" title="Generate Receipt">
                                  <Download size={18} />
                              </button>
                            </div>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bottom pagination or stats footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-10 py-6 bg-[#0f172a] rounded-[2rem] shadow-xl">
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">Total Period Flow</span>
                    <span className="text-lg font-black text-white">
                        {getCurrencySymbol(filtered[0]?.currency || Currency.USD)}
                        {filtered.reduce((sum, t) => sum + (t.type === TransactionType.INCOME ? t.amount : -t.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-white">
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400 transition-colors">Prev</button>
                <div className="flex gap-1">
                    <span className="w-8 h-8 flex items-center justify-center bg-cyan-500 rounded-lg text-xs font-black">1</span>
                    <span className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-lg text-xs font-black cursor-pointer">2</span>
                </div>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400 transition-colors">Next</button>
            </div>
        </div>
      )}

      {/* Approval Verification Modal */}
      {approvalTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">System Approval</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Verification Protocol</p>
                </div>
              </div>
              <button onClick={() => setApprovalTarget(null)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                <X size={20} className="text-slate-400 hover:text-slate-900" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col gap-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Target Entry</span>
                <p className="text-lg font-black text-slate-900">{approvalTarget.description || approvalTarget.category}</p>
                <p className="text-2xl font-black text-blue-600">
                  {getCurrencySymbol(approvalTarget.currency)}{approvalTarget.amount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  {approvalTarget.type === TransactionType.INCOME ? 'Digital Receipt Number' : 'Job Card Number'}
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                    {approvalTarget.type === TransactionType.INCOME ? <Receipt size={20} /> : <FileCheck size={20} />}
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder={approvalTarget.type === TransactionType.INCOME ? "e.g. RCT-2024-001" : "e.g. JBC-MEDIA-88"}
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-cyan-400 focus:ring-8 focus:ring-cyan-50 transition-all text-sm font-black text-slate-900 uppercase tracking-widest placeholder:normal-case placeholder:font-bold placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleApprove}
                  disabled={!referenceInput.trim()}
                  className="w-full bg-[#0f172a] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                >
                  Confirm & Commit Approved
                </button>
                <button 
                  onClick={() => setApprovalTarget(null)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Cancel Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Action Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                  <LayoutGrid className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Batch Approval</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bulk Entry Verification</p>
                </div>
              </div>
              <button onClick={() => setIsBatchModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                <X size={20} className="text-slate-400 hover:text-slate-900" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col gap-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Affected Entries</span>
                <p className="text-lg font-black text-slate-900">
                  {filtered.filter(tx => tx.status === TransactionStatus.PENDING).length} Pending Transactions
                </p>
                <p className="text-sm font-bold text-slate-500 italic">
                  Approving all currently filtered pending transactions.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Common Reference Batch ID
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                    <FileCheck size={20} />
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. BATCH-SUN-OFFERING-2024"
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-cyan-400 focus:ring-8 focus:ring-cyan-50 transition-all text-sm font-black text-slate-900 uppercase tracking-widest placeholder:normal-case placeholder:font-bold placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleBatchApprove}
                  disabled={!referenceInput.trim() || filtered.filter(tx => tx.status === TransactionStatus.PENDING).length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-blue-600/10 transition-all active:scale-95"
                >
                  Confirm Batch Commit
                </button>
                <button 
                  onClick={() => setIsBatchModalOpen(false)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Cancel Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
