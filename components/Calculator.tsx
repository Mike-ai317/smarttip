import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Percent, Minus, Plus, RefreshCcw } from 'lucide-react';
import { BillState, CalculationResult } from '../types';

interface CalculatorProps {
  initialAmount?: number;
  initialCurrency?: string;
  onScanRequest: () => void;
}

const TIP_PERCENTAGES = [10, 15, 18, 20, 25];

export const Calculator: React.FC<CalculatorProps> = ({ initialAmount, initialCurrency, onScanRequest }) => {
  const [bill, setBill] = useState<BillState>({
    amount: initialAmount || 0,
    tipPercentage: 15,
    peopleCount: 1,
    currency: initialCurrency || '$'
  });

  const [result, setResult] = useState<CalculationResult>({
    tipAmount: 0,
    totalAmount: 0,
    tipPerPerson: 0,
    totalPerPerson: 0
  });

  // Update local state if props change (e.g. from scanner)
  useEffect(() => {
    if (initialAmount !== undefined) {
      setBill(prev => ({ ...prev, amount: initialAmount, currency: initialCurrency || prev.currency }));
    }
  }, [initialAmount, initialCurrency]);

  useEffect(() => {
    const tipAmount = bill.amount * (bill.tipPercentage / 100);
    const totalAmount = bill.amount + tipAmount;
    
    setResult({
      tipAmount,
      totalAmount,
      tipPerPerson: tipAmount / bill.peopleCount,
      totalPerPerson: totalAmount / bill.peopleCount
    });
  }, [bill]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBill({ ...bill, amount: isNaN(val) ? 0 : val });
  };

  const adjustPeople = (delta: number) => {
    setBill(prev => ({ 
      ...prev, 
      peopleCount: Math.max(1, prev.peopleCount + delta) 
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: bill.currency === '$' ? 'USD' : 'EUR', // Simplified mapping for demo
      currencyDisplay: 'narrowSymbol'
    }).format(val).replace('US', ''); // Quick hack to ensure just symbol if locale acts up
  };
  
  // Custom helper because the above might show US$
  const displayMoney = (val: number) => {
    return `${bill.currency}${val.toFixed(2)}`;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Input Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-6 space-y-6">
          
          {/* Bill Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bill Amount</label>
              <button 
                onClick={onScanRequest}
                className="text-xs flex items-center gap-1 text-primary-600 bg-primary-50 px-2 py-1 rounded-full font-medium hover:bg-primary-100 transition-colors"
              >
                <RefreshCcw size={12} /> Auto-Fill via AI
              </button>
            </div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-light">
                {bill.currency}
              </span>
              <input
                type="number"
                value={bill.amount || ''}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-xl text-3xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Tip Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tip %</label>
               <span className="text-sm font-bold text-primary-600">{bill.tipPercentage}%</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {TIP_PERCENTAGES.map(pct => (
                <button
                  key={pct}
                  onClick={() => setBill({ ...bill, tipPercentage: pct })}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${
                    bill.tipPercentage === pct
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            
            <div className="relative pt-2">
               <input
                type="range"
                min="0"
                max="100"
                value={bill.tipPercentage}
                onChange={(e) => setBill({...bill, tipPercentage: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>

          {/* Split */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Split</label>
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
              <button 
                onClick={() => adjustPeople(-1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-primary-600 active:scale-95 transition-all"
              >
                <Minus size={20} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">{bill.peopleCount}</span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Users size={10} /> Person{bill.peopleCount > 1 ? 's' : ''}
                </span>
              </div>
              <button 
                onClick={() => adjustPeople(1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-primary-600 active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Result Card */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-20"></div>

        <div className="relative z-10 space-y-6">
          
          <div className="flex justify-between items-end pb-6 border-b border-slate-700/50">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total per person</p>
              <h2 className="text-5xl font-bold tracking-tight text-white">{displayMoney(result.totalPerPerson)}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Bill</p>
              <p className="text-xl font-semibold text-slate-200">{displayMoney(result.totalAmount)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Tip</p>
              <p className="text-xl font-semibold text-primary-400">{displayMoney(result.tipAmount)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Tip / Person</p>
              <p className="text-xl font-semibold text-slate-200">{displayMoney(result.tipPerPerson)}</p>
            </div>
             <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Bill / Person</p>
              <p className="text-xl font-semibold text-slate-200">{displayMoney(result.totalAmount / bill.peopleCount)}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
