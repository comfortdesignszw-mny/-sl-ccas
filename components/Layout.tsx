
import React from 'react';
import { Search, Bell, HelpCircle, PlusCircle, Church } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { UserProfile } from '../types';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  onAddTransaction: () => void;
  userProfile: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children, onAddTransaction, userProfile }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="bg-cyan-500 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
            <Church className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-black text-white text-lg tracking-tighter leading-tight">CCAS</h1>
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Sacred Ledger</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800/50">
          <button 
            onClick={onAddTransaction}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/10 font-black text-sm active:scale-95 mb-6"
          >
            <PlusCircle size={20} />
            New Entry
          </button>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/user/100/100" 
                className="w-10 h-10 rounded-xl object-cover border border-slate-600 shadow-inner" 
                alt="Admin"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-[#0f172a]"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{userProfile.name}</p>
              <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">{userProfile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-6">
             <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h2>
             <div className="h-6 w-px bg-slate-100 hidden md:block"></div>
             <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span>Core</span>
                <span className="text-slate-200">/</span>
                <span className="text-blue-600">{activeTab}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global ledger search..." 
                className="bg-slate-50 border-transparent focus:bg-white focus:border-cyan-200 focus:ring-4 focus:ring-cyan-50 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold transition-all outline-none w-72 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all">
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
