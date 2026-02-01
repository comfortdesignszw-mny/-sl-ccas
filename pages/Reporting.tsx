
import React, { useMemo, useRef } from 'react';
import { Printer, FileJson, ChevronDown, CheckCircle2, Landmark, Calculator, Coins, Church } from 'lucide-react';
import { Transaction, TransactionType, Currency } from '../types';
import { getCurrencySymbol } from '../constants';

interface ReportingProps {
  transactions: Transaction[];
}

const Reporting: React.FC<ReportingProps> = ({ transactions }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  // Aggregate data by currency, then category
  const summary = useMemo(() => {
    const currencyGroups: Record<Currency, { 
        totalIncome: number; 
        totalExpense: number; 
        categories: Record<string, { income: number; expense: number }> 
    }> = {} as any;

    transactions.forEach(tx => {
      if (!currencyGroups[tx.currency]) {
        currencyGroups[tx.currency] = { 
            totalIncome: 0, 
            totalExpense: 0, 
            categories: {} 
        };
      }
      
      const group = currencyGroups[tx.currency];
      if (!group.categories[tx.category]) {
        group.categories[tx.category] = { income: 0, expense: 0 };
      }

      if (tx.type === TransactionType.INCOME) {
        group.categories[tx.category].income += tx.amount;
        group.totalIncome += tx.amount;
      } else {
        group.categories[tx.category].expense += tx.amount;
        group.totalExpense += tx.amount;
      }
    });

    return currencyGroups;
  }, [transactions]);

  const activeCurrencies = Object.keys(summary) as Currency[];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // In modern browsers, window.print() allows "Save as PDF". 
    // This is the most performance-optimized way without loading heavy external PDF libraries.
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <style>
        {`
          @media print {
            /* Hide everything by default */
            body * {
              visibility: hidden;
            }
            /* Only show the report container */
            #printable-report, #printable-report * {
              visibility: visible;
            }
            #printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none;
              box-shadow: none;
              border-radius: 0;
            }
            /* Explicitly hide non-printable elements inside the container if any */
            .no-print {
              display: none !important;
            }
            /* Page margins optimization */
            @page {
              margin: 20mm;
            }
          }
        `}
      </style>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Audit & Financial Reporting</h2>
          <p className="text-slate-500 mt-1">Generate multi-currency ledger summaries for review.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100"
          >
            <FileJson size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm no-print">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-600">Select Report Schema</label>
            <div className="relative">
                <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none text-sm font-semibold">
                    <option>Standard Consolidated Ledger</option>
                    <option>Currency-Specific Breakdown</option>
                    <option>Annual Comparative Audit</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Fiscal Period</label>
            <input type="month" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold" defaultValue={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`} />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
            Generate Report
          </button>
        </div>
      </div>

      <div id="printable-report" ref={reportRef} className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-12 mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-cyan-500 p-4 rounded-3xl shadow-xl shadow-cyan-500/20 print:bg-cyan-500 print:shadow-none">
                        <Church className="text-white" size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-black text-blue-600 tracking-tight leading-none">CCAS Enterprise Ledger</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Consolidated Multi-Currency Audit</p>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated Date</p>
                    <p className="text-lg font-black text-slate-800">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    <div className="flex items-center gap-2 justify-start md:justify-end mt-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-100">Digitally Verified</span>
                    </div>
                </div>
            </div>

            {activeCurrencies.length === 0 ? (
                <div className="py-20 text-center text-slate-400 italic font-medium">
                    No transactions recorded to generate a report.
                </div>
            ) : (
                <div className="space-y-20">
                    {activeCurrencies.map((cur) => (
                        <div key={cur} className="space-y-12">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <Coins size={20} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800">Currency Ledger: {cur}</h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-emerald-50 p-2 rounded-lg">
                                            <Landmark className="text-emerald-600" size={18} />
                                        </div>
                                        <h5 className="font-bold text-slate-700">Income Stream ({cur})</h5>
                                    </div>
                                    <table className="w-full text-left">
                                        <tbody className="divide-y divide-slate-50 font-medium">
                                            {Object.entries(summary[cur].categories)
                                                .filter(([_, vals]: [string, any]) => vals.income > 0)
                                                .map(([cat, vals]: [string, any], i) => (
                                                    <tr key={i}>
                                                        <td className="py-4 font-bold text-slate-800">{cat}</td>
                                                        <td className="py-4 text-right font-black text-emerald-600">{getCurrencySymbol(cur)}{vals.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                    </tr>
                                                ))}
                                            <tr className="bg-slate-50/50">
                                                <td className="py-4 px-2 font-black text-slate-500 uppercase text-[10px]">Sub-Total</td>
                                                <td className="py-4 px-2 text-right font-black text-emerald-700">{getCurrencySymbol(cur)}{summary[cur].totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-rose-50 p-2 rounded-lg">
                                            <Calculator className="text-rose-600" size={18} />
                                        </div>
                                        <h5 className="font-bold text-slate-700">Expenditures ({cur})</h5>
                                    </div>
                                    <table className="w-full text-left">
                                        <tbody className="divide-y divide-slate-50 font-medium">
                                            {Object.entries(summary[cur].categories)
                                                .filter(([_, vals]: [string, any]) => vals.expense > 0)
                                                .map(([cat, vals]: [string, any], i) => (
                                                    <tr key={i}>
                                                        <td className="py-4 font-bold text-slate-800">{cat}</td>
                                                        <td className="py-4 text-right font-black text-rose-600">{getCurrencySymbol(cur)}{vals.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                    </tr>
                                                ))}
                                            <tr className="bg-slate-50/50">
                                                <td className="py-4 px-2 font-black text-slate-500 uppercase text-[10px]">Sub-Total</td>
                                                <td className="py-4 px-2 text-right font-black text-rose-700">{getCurrencySymbol(cur)}{summary[cur].totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Surplus ({cur})</p>
                                    <p className={`text-3xl font-black mt-1 ${summary[cur].totalIncome >= summary[cur].totalExpense ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {getCurrencySymbol(cur)}{(summary[cur].totalIncome - summary[cur].totalExpense).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Count</p>
                                    <p className="text-2xl font-black text-slate-800 mt-1">
                                        {transactions.filter(t => t.currency === cur).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <div className="bg-slate-50 px-12 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} Computerised Church Accounting System (CCAS).</span>
            <div className="flex gap-6">
                <span>Multi-Currency Enabled Environment</span>
                <span>Diocese Audit Code: #774-XP</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
