import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { analyzeReceipt } from '../services/geminiService';

interface ScannerProps {
  onScanComplete: (amount: number, currency: string) => void;
  onCancel: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];

        try {
          const result = await analyzeReceipt(base64Data);
          if (result.total !== null && result.total !== undefined) {
            onScanComplete(result.total, result.currency || '$');
          } else {
            setError("Could not find a total on this receipt. Please try again or enter manually.");
          }
        } catch (err) {
            console.error(err);
            setError("Failed to analyze receipt. Please check your internet connection.");
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError("Error reading file.");
      setIsScanning(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Scan Receipt</h3>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <X size={20} />
        </button>
      </div>

      <div 
        className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
          isScanning ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-500 hover:bg-slate-50'
        }`}
        onClick={!isScanning ? triggerFileInput : undefined}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          capture="environment" // Hints mobile browsers to use camera
          onChange={handleFileChange}
        />

        {isScanning ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="text-primary-700 font-medium animate-pulse">Analyzing receipt with AI...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mb-2">
              <Camera size={32} />
            </div>
            <p className="font-medium text-slate-700">Tap to take photo or upload</p>
            <p className="text-xs text-slate-400">Supports JPG, PNG</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm w-full">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 w-full">
        <p className="text-xs text-slate-400 text-center mb-4">
          Powered by Gemini 2.5 Flash. We extract the total automatically.
        </p>
      </div>
    </div>
  );
};
