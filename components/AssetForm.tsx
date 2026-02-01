
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Landmark, Coins, CheckCircle2, Home, BarChart3, ShieldCheck, Edit3 } from 'lucide-react';
import { Asset, AssetType, Currency } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface AssetFormProps {
  onClose: () => void;
  onSave: (asset: any) => void;
  defaultCurrency: Currency;
  asset?: Asset;
}

const AssetForm: React.FC<AssetFormProps> = ({ onClose, onSave, defaultCurrency, asset }) => {
  const valueRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: AssetType.FIXED,
    value: '',
    currency: defaultCurrency,
    condition: 'Excellent' as 'Excellent' | 'Good' | 'Fair' | 'Poor',
    lastValuation: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        type: asset.type,
        value: asset.value.toString(),
        currency: asset.currency,
        condition: asset.condition,
        lastValuation: asset.lastValuation
      });
    }
  }, [asset]);

  useEffect(() => {
    setTimeout(() => valueRef.current?.focus(), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return;
    
    onSave({
      ...formData,
      value: parseFloat(formData.value)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              {asset ? <Edit3 className="text-white" size={24} /> : <ShieldCheck className="text-white" size={24} />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{asset ? 'Modify Asset' : 'Register Asset'}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Asset Registry System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all group">
            <X size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
              <div className="relative group">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  required
                  type="text"
                  placeholder="e.g. Main Sanctuary Land, Sound Console"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AssetType })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                  >
                    <option value={AssetType.FIXED}>Fixed Asset</option>
                    <option value={AssetType.LIQUID}>Liquid Asset</option>
                    <option value={AssetType.INTANGIBLE}>Intangible Asset</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                  >
                    {CURRENCY_OPTIONS.map(opt => <option key={opt.code} value={opt.code}>{opt.code}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Valuation</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  {CURRENCY_OPTIONS.find(c => c.code === formData.currency)?.symbol}
                </span>
                <input
                  ref={valueRef}
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full pl-14 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all text-3xl font-black text-slate-900 tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Valuation Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="date"
                    required
                    value={formData.lastValuation}
                    onChange={(e) => setFormData({ ...formData, lastValuation: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3.5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> {asset ? 'Update Registry' : 'Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
