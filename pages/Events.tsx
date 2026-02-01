
import React from 'react';
import { Filter, Download, Plus, Target, Users, Landmark, MoreVertical, Edit2, FileText, ChevronRight, ShieldCheck, Heart, Trash2 } from 'lucide-react';
import { ChurchEvent, Currency } from '../types';
import { getCurrencySymbol } from '../constants';

interface EventsProps {
  events: ChurchEvent[];
  defaultCurrency: Currency;
  onInitCampaign: () => void;
  onRecordEntry: (eventId: string) => void;
  onDeleteEvent?: (id: string) => void;
}

const Events: React.FC<EventsProps> = ({ events, defaultCurrency, onInitCampaign, onRecordEntry, onDeleteEvent }) => {
  const currencySymbol = getCurrencySymbol(defaultCurrency);

  const exportEventAuditLog = () => {
    if (events.length === 0) return;

    const headers = [
      'ID', 'Campaign Name', 'Description', 'Status', 'Target Amount', 'Current Progress', 'Progress %'
    ];

    const rows = events.map(ev => {
      const progress = ((ev.currentAmount / ev.targetAmount) * 100).toFixed(2);
      return [
        ev.id,
        `"${ev.name.replace(/"/g, '""')}"`,
        `"${ev.description.replace(/"/g, '""')}"`,
        ev.status,
        ev.targetAmount,
        ev.currentAmount,
        `${progress}%`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CCAS_Campaign_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" campaign? This will unbind it from all existing transactions.`)) {
      onDeleteEvent?.(id);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Campaigns & Missions</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
            <Target size={14} className="text-cyan-500" /> Active Contribution Targets ({defaultCurrency})
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportEventAuditLog}
            className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={16} className="text-cyan-500" /> Audit Log
          </button>
          <button 
            onClick={onInitCampaign}
            className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10 active:scale-95"
          >
            <Plus size={16} /> Init Campaign
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-3xl group-hover:scale-110 transition-transform">
            <Landmark size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Projects</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#0f172a]">{events.length}</span>
              <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-100">Live Status</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <div className="bg-blue-600 text-white p-4 rounded-3xl relative z-10">
             <Target size={28} />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-blue-200/60 text-[10px] font-black uppercase tracking-widest mb-1">Goal Trajectory</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-black text-white">
                {events.length > 0 
                  ? (events.reduce((sum, ev) => sum + (ev.currentAmount / ev.targetAmount), 0) / events.length * 100).toFixed(0) 
                  : 0}%
              </span>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Aggregate</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/40 transition-all duration-1000" 
                  style={{ width: `${events.length > 0 ? (events.reduce((sum, ev) => sum + (ev.currentAmount / ev.targetAmount), 0) / events.length * 100) : 0}%` }}
                ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group">
          <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl group-hover:scale-110 transition-transform">
             <Heart size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pledged</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-300">{currencySymbol}</span>
              <span className="text-3xl font-black text-[#0f172a]">
                {(events.reduce((sum, ev) => sum + ev.targetAmount, 0) / 1000).toLocaleString()}k
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
          <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Financial Milestones</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {events.map((event) => {
          const progress = (event.currentAmount / event.targetAmount) * 100;
          return (
            <div key={event.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="relative h-64 overflow-hidden">
                <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                    <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-xl ${
                        event.status === 'Ongoing' ? 'bg-cyan-500/90 text-white' : 'bg-blue-600/90 text-white'
                    }`}>
                        {event.status}
                    </span>
                </div>
                <div className="absolute bottom-6 left-8 right-8">
                    <h4 className="text-3xl font-black text-white tracking-tighter leading-tight">{event.name}</h4>
                </div>
              </div>

              <div className="p-10">
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 h-12 line-clamp-2">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Unit</p>
                        <p className="text-xl font-black text-[#0f172a]">{currencySymbol}250.00</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Target</p>
                        <p className="text-xl font-black text-[#0f172a]">{currencySymbol}{(event.targetAmount / 1000).toLocaleString()}k</p>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vault Balance</span>
                            <span className="text-lg font-black text-blue-600">{currencySymbol}{event.currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Progress</span>
                            <span className="text-lg font-black text-[#0f172a]">{progress.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-100">
                        <div 
                            className="h-full bg-cyan-500 rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/30"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onRecordEntry(event.id)}
                    className="flex-1 bg-[#0f172a] hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-[1.5rem] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Landmark size={16} className="text-cyan-400" /> Record Entry
                  </button>
                  <button className="p-4 bg-slate-50 text-slate-400 hover:text-[#0f172a] hover:bg-slate-100 rounded-[1.5rem] transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id, event.name)}
                    className="p-4 bg-rose-50 text-rose-500 hover:text-white hover:bg-rose-500 rounded-[1.5rem] transition-all shadow-sm"
                    title="Delete Campaign"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Footer */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
          <div className="flex items-center gap-6">
              <div className="p-4 bg-cyan-50 text-cyan-600 rounded-3xl border border-cyan-100">
                  <ShieldCheck size={32} />
              </div>
              <div className="max-w-md">
                  <h4 className="text-lg font-black text-[#0f172a] tracking-tight">Audit Trail Enabled</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Every contribution is indexed in the {defaultCurrency} master ledger for quarterly reporting.</p>
              </div>
          </div>
          <button className="px-8 py-4 bg-slate-50 text-[#0f172a] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all">
              View Audit Policy
          </button>
      </div>
    </div>
  );
};

export default Events;
