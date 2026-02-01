
import React, { useState, useRef } from 'react';
import { Cloud, Save, RotateCcw, Trash2, Database, ShieldCheck, Coins, User, Building, Phone, Mail, Globe, Image as ImageIcon, Upload } from 'lucide-react';
import { Currency, UserProfile, ChurchProfile } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface SettingsProps {
  onClear: () => void;
  onBackup: () => void;
  defaultCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  userProfile: UserProfile;
  churchProfile: ChurchProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  onUpdateChurchProfile: (profile: ChurchProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  onClear, 
  onBackup, 
  defaultCurrency, 
  onCurrencyChange,
  userProfile,
  churchProfile,
  onUpdateUserProfile,
  onUpdateChurchProfile
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Local form states
  const [userForm, setUserForm] = useState<UserProfile>(userProfile);
  const [churchForm, setChurchForm] = useState<ChurchProfile>(churchProfile);

  const handleUserSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile(userForm);
  };

  const handleChurchSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateChurchProfile(churchForm);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChurchForm({ ...churchForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      {/* 1. Personal Profile Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#0f172a] tracking-tight">User Identity Protocol</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Operator Authentication Settings</p>
                </div>
            </div>
            <button 
              onClick={handleUserSave}
              className="px-6 py-2.5 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Save size={14} className="text-cyan-400" /> Save Personal Data
            </button>
        </div>
        <form onSubmit={handleUserSave} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designated Role / Duty</label>
                <div className="relative">
                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact Number</label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={userForm.contact}
                      onChange={(e) => setUserForm({...userForm, contact: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>
        </form>
      </div>

      {/* 2. Church Organization Profile Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
                <div className="bg-cyan-500 p-3 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
                    <Building size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#0f172a] tracking-tight">Church Organization Profile</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Corporate Branch Registry</p>
                </div>
            </div>
            <button 
              onClick={handleChurchSave}
              className="px-6 py-2.5 bg-cyan-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-cyan-600 transition-all flex items-center gap-2"
            >
              <Save size={14} /> Commit Org Changes
            </button>
        </div>
        <form onSubmit={handleChurchSave} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Church Name</label>
                    <input 
                      type="text" 
                      placeholder="Organization Name"
                      value={churchForm.name}
                      onChange={(e) => setChurchForm({...churchForm, name: e.target.value})}
                      className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch / Assembly</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Main Tabernacle"
                      value={churchForm.branch}
                      onChange={(e) => setChurchForm({...churchForm, branch: e.target.value})}
                      className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                    <input 
                      type="text" 
                      value={churchForm.district}
                      onChange={(e) => setChurchForm({...churchForm, district: e.target.value})}
                      className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Province / State</label>
                    <input 
                      type="text" 
                      value={churchForm.province}
                      onChange={(e) => setChurchForm({...churchForm, province: e.target.value})}
                      className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={churchForm.address}
                      onChange={(e) => setChurchForm({...churchForm, address: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Contact</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="text" 
                          value={churchForm.contact}
                          onChange={(e) => setChurchForm({...churchForm, contact: e.target.value})}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Domain</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="email" 
                          value={churchForm.email}
                          onChange={(e) => setChurchForm({...churchForm, email: e.target.value})}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Web Presence URL</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="https://"
                      value={churchForm.website}
                      onChange={(e) => setChurchForm({...churchForm, website: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-sm font-bold text-slate-900" 
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizational Logo</label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-32 h-32 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden shrink-0 group hover:border-cyan-400 transition-colors">
                        {churchForm.logo ? (
                            <img src={churchForm.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            <ImageIcon className="text-slate-200 group-hover:text-cyan-300 transition-colors" size={40} />
                        )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                  type="text" 
                                  placeholder="Branding URL..."
                                  value={churchForm.logo}
                                  onChange={(e) => setChurchForm({...churchForm, logo: e.target.value})}
                                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 text-[10px] font-bold text-slate-900" 
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cyan-500 hover:border-cyan-200 transition-all group"
                            >
                                <Upload size={20} />
                            </button>
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                            Recommended: High resolution transparent PNG (256x256 minimum) for optimized multi-device rendering.
                        </p>
                    </div>
                </div>
            </div>
        </form>
      </div>

      {/* 3. Financial Localization Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="bg-[#0f172a] p-3 rounded-2xl text-white">
                <Coins size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight">Financial Localization</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Base Currency Configuration</p>
            </div>
        </div>
        <div className="p-10 space-y-8">
            <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary System Currency</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CURRENCY_OPTIONS.map((opt) => (
                        <button
                            key={opt.code}
                            onClick={() => onCurrencyChange(opt.code)}
                            className={`p-6 rounded-[2rem] border-2 transition-all text-center group ${
                                defaultCurrency === opt.code
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-slate-50 bg-white hover:border-slate-200'
                            }`}
                        >
                            <span className={`block text-2xl font-black mb-1 ${defaultCurrency === opt.code ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-600'}`}>
                                {opt.symbol}
                            </span>
                            <span className={`block text-[10px] font-black uppercase tracking-[0.2em] ${defaultCurrency === opt.code ? 'text-blue-600' : 'text-slate-400'}`}>
                                {opt.code}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[11px] text-blue-600 font-bold leading-relaxed">
                        <ShieldCheck size={14} className="inline mr-2 mb-0.5" />
                        System default currency affects all dashboard aggregate views and multi-currency conversion defaults.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-between p-8 bg-[#0f172a] rounded-[2.5rem] shadow-2xl shadow-slate-900/10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Cloud className="text-cyan-400" size={18} />
                        <h4 className="font-black text-white tracking-tight">Cloud Persistence Active</h4>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automatic background synchronization enabled</p>
                </div>
                <button 
                  onClick={onBackup}
                  className="bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
                >
                    <Save size={16} /> Force Sync Now
                </button>
            </div>

            <div className="space-y-6">
                <h4 className="text-lg font-black text-[#0f172a] flex items-center gap-2 tracking-tight">
                    <Database size={20} className="text-blue-600" /> Administrative Controls
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-slate-50 rounded-[2rem] space-y-6 hover:border-blue-100 transition-all group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <RotateCcw size={24} />
                        </div>
                        <div>
                            <p className="font-black text-[#0f172a] text-sm">Restore Ledger</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upload encrypted CCAS backup</p>
                        </div>
                        <input type="file" className="hidden" id="restore-file" />
                        <label htmlFor="restore-file" className="block w-full py-4 text-center bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                            Upload Archive
                        </label>
                    </div>

                    <div className="p-8 border-2 border-slate-50 rounded-[2rem] space-y-6 hover:border-rose-100 transition-all group">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p className="font-black text-[#0f172a] text-sm">Factory Reset</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Permanently purge all data</p>
                        </div>
                        <button 
                            onClick={() => {
                                if(confirm('System Purge Warning: This action will permanently delete all transaction records, events, and configuration. Are you sure?')) {
                                    onClear();
                                }
                            }}
                            className="w-full py-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all"
                        >
                            Purge Records
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
