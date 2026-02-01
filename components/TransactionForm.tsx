
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, List, CreditCard, FileText, Info, Coins, CheckCircle2, RefreshCcw } from 'lucide-react';
import { TransactionType, TransactionStatus, ChurchEvent, Currency } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS, CURRENCY_OPTIONS } from '../constants';

interface TransactionFormProps {
  onClose: () => void;
  onSave: (tx: any) => void;
  events: ChurchEvent[];
  defaultCurrency: Currency;
  initialEventId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSave, events, defaultCurrency, initialEventId }) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: INCOME_CATEGORIES[0],
    method: PAYMENT_METHODS[0],
    currency: defaultCurrency,
    eventId: initialEventId || '',
    description: ''
  });

  // Sync category when flow type changes
  useEffect(() => {
    const newCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setFormData(prev => ({ ...prev, category: newCategories[0] }));
  }, [type]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, currency: defaultCurrency }));
    // Autofocus amount field for smoother entry
    setTimeout(() => amountRef.current?.focus(), 100);
  }, [defaultCurrency]);

  const resetForm = () => {
    setFormData({
      ...formData,
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    amountRef.current?.focus();
  };

  const handlePost = (stayOpen: boolean = false) => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      type,
      status: TransactionStatus.PENDING
    });

    if (stayOpen) {
      resetForm();
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost(false);
  };

  const currentCategoryList = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg shadow-cyan-500/20">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Record Entry</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Financial Verification System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all group">
            <X size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Type Switcher */}
              <div className="flex-1 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flow Type</label>
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full">
                  <button
                    type="button"
                    onClick={() => setType(TransactionType.INCOME)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      type === TransactionType.INCOME ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setType(TransactionType.EXPENSE)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      type === TransactionType.EXPENSE ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Currency */}
              <div className="w-full md:w-48 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 focus:border-cyan-400 transition-all text-xs font-black text-slate-900 appearance-none"
                  >
                    {CURRENCY_OPTIONS.map(opt => <option key={opt.code} value={opt.code}>{opt.code}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Value</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                  {CURRENCY_OPTIONS.find(c => c.code === formData.currency)?.symbol}
                </span>
                <input
                  ref={amountRef}
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-14 pr-6 py-8 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:bg-white focus:border-cyan-400 focus:ring-8 focus:ring-cyan-50 transition-all text-4xl font-black text-slate-900 tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic Classification */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                <div className="relative">
                  <List className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                  >
                    {currentCategoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method of Payment</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                  >
                    {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
              </div>

              {/* Campaign Link with 'Other' */}
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Link</label>
                  <div className="relative">
                    <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                        value={formData.eventId}
                        onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 appearance-none"
                    >
                        <option value="">General Fund</option>
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                        <option value="other">Other / Unlisted</option>
                    </select>
                  </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Details & Remarks</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-400" size={16} />
                <textarea
                  rows={2}
                  placeholder="Memo for this transaction..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-xs font-bold text-slate-900 resize-none placeholder:text-slate-300"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] leading-relaxed text-blue-800/70 font-bold">
              Verification system engaged. All records are indexed for quarterly auditing and multi-currency reporting.
            </p>
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
              type="button"
              onClick={() => handlePost(true)}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-800 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Post & Another
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
            >
              Commit Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
