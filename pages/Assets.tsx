
import React, { useMemo } from 'react';
import { Wallet, Landmark, Home, ShieldCheck, Plus, Search, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import { Asset, AssetType, Currency } from '../types';
import { getCurrencySymbol } from '../constants';

interface AssetsProps {
  assets: Asset[];
  defaultCurrency: Currency;
  onRegisterAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

const Assets: React.FC<AssetsProps> = ({ assets, defaultCurrency, onRegisterAsset, onEditAsset, onDeleteAsset }) => {
  const currencySymbol = getCurrencySymbol(defaultCurrency);

  const stats = useMemo(() => {
    const filteredAssets = assets.filter(a => a.currency === defaultCurrency);
    const total = filteredAssets.reduce((sum, a) => sum + a.value, 0);
    const fixed = filteredAssets.filter(a => a.type === AssetType.FIXED).reduce((sum, a) => sum + a.value, 0);
    const liquid = filteredAssets.filter(a => a.type === AssetType.LIQUID).reduce((sum, a) => sum + a.value, 0);
    
    return { total, fixed, liquid, count: filteredAssets.length };
  }, [assets, defaultCurrency]);

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.FIXED: return <Home size={20} />;
      case AssetType.LIQUID: return <Landmark size={20} />;
      default: return <Wallet size={20} />;
    }
  };

  const exportAssetLog = () => {
    if (assets.length === 0) return;

    const headers = [
      'ID', 'Asset Name', 'Type', 'Value', 'Currency', 'Condition', 'Last Valuation'
    ];

    const rows = assets.map(asset => [
      asset.id,
      `"${asset.name.replace(/"/g, '""')}"`,
      asset.type,
      asset.value,
      asset.currency,
      asset.condition,
      asset.lastValuation
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CCAS_Asset_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the asset "${name}" from the registry?`)) {
      onDeleteAsset(id);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Church Assets & Valuations</h2>
          <p className="text-slate-500 mt-1">Management of physical properties and liquid holdings in {defaultCurrency}.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportAssetLog}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} /> Asset Log
          </button>
          <button 
            onClick={onRegisterAsset}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Register Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Asset Base</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-400">{currencySymbol}</span>
            <h3 className="text-3xl font-black text-slate-800">{stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Values synced to {defaultCurrency}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Fixed Properties</p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <Home size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-400">{currencySymbol}</span>
            <h3 className="text-3xl font-black text-slate-800">{stats.fixed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Land, Buildings & Gear</p>
        </div>

        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 font-bold text-xs uppercase tracking-widest">Liquid Reserves</p>
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <Landmark size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-blue-200">{currencySymbol}</span>
            <h3 className="text-3xl font-black text-white">{stats.liquid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <p className="mt-2 text-[10px] font-bold text-blue-200 uppercase tracking-widest">Available Cash & Bank</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-lg font-bold text-slate-800">Asset Registry</h4>
          <div className="flex gap-4">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Filter assets..." className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-4 focus:ring-blue-100 w-48 transition-all" />
            </div>
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Description</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Valued</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Value ({defaultCurrency})</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.filter(a => a.currency === defaultCurrency).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic">No assets registered in {defaultCurrency} currency.</td>
                </tr>
              ) : (
                assets.filter(a => a.currency === defaultCurrency).map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {getAssetIcon(asset.type)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{asset.type}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        asset.condition === 'Excellent' ? 'bg-emerald-50 text-emerald-600' :
                        asset.condition === 'Good' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                      {new Date(asset.lastValuation).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-slate-800">
                        {currencySymbol}{asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEditAsset(asset)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Asset"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(asset.id, asset.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Asset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
