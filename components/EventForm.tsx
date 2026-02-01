
import React, { useState, useRef } from 'react';
import { X, Target, FileText, Image, CheckCircle2, Upload, Camera } from 'lucide-react';

interface EventFormProps {
  onClose: () => void;
  onSave: (event: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
    status: 'Ongoing' as 'Ongoing' | 'Starting Soon' | 'Completed'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;
    
    onSave({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Init Campaign</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Project Fundraising Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all group">
            <X size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Name</label>
              <input
                required
                type="text"
                placeholder="e.g. New Sanctuary Roofing, Youth Camp 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Target Amount</label>
              <input
                required
                type="number"
                placeholder="Enter goal amount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                 <select
                   value={formData.status}
                   onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-xs font-bold text-slate-900 appearance-none"
                 >
                   <option value="Ongoing">Ongoing</option>
                   <option value="Starting Soon">Starting Soon</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Image size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        placeholder="Image URL..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-[10px] font-bold text-slate-900 truncate"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all group"
                      title="Upload File"
                    >
                      <Upload size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload} 
                    />
                 </div>
               </div>
            </div>

            {/* Image Preview if not default or if uploaded */}
            {formData.image && (
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest">Image Preview</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Description</label>
              <textarea
                rows={3}
                placeholder="Details about the mission..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all text-xs font-bold text-slate-900 resize-none"
              ></textarea>
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
              <CheckCircle2 size={18} /> Launch Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
