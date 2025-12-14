import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { Scanner } from './components/Scanner';
import { AppMode } from './types';
import { Github, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CALCULATOR);
  const [scannedAmount, setScannedAmount] = useState<number | undefined>(undefined);
  const [scannedCurrency, setScannedCurrency] = useState<string | undefined>(undefined);

  const handleScanComplete = (amount: number, currency: string) => {
    setScannedAmount(amount);
    setScannedCurrency(currency);
    setMode(AppMode.CALCULATOR);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 text-slate-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              SmartTip
            </h1>
          </div>
          <a href="#" className="text-slate-400 hover:text-slate-800 transition-colors">
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {mode === AppMode.CALCULATOR ? 'Split the bill, hassle-free' : 'Scan your receipt'}
            </h2>
            <p className="text-slate-500">
              {mode === AppMode.CALCULATOR 
                ? 'Enter the amount manually or scan a receipt to get started.' 
                : 'Upload a photo of your receipt and we will extract the total.'}
            </p>
        </div>

        {mode === AppMode.CALCULATOR ? (
          <Calculator 
            initialAmount={scannedAmount} 
            initialCurrency={scannedCurrency}
            onScanRequest={() => setMode(AppMode.SCANNER)}
          />
        ) : (
          <Scanner 
            onScanComplete={handleScanComplete}
            onCancel={() => setMode(AppMode.CALCULATOR)}
          />
        )}
      </main>

      {/* Footer/Sticky Info if needed */}
      <footer className="fixed bottom-0 left-0 w-full p-4 text-center text-xs text-slate-400 bg-white/50 backdrop-blur-sm pointer-events-none">
        &copy; {new Date().getFullYear()} SmartTip. Powered by Gemini.
      </footer>
    </div>
  );
};

export default App;
