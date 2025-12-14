export interface BillState {
  amount: number;
  tipPercentage: number;
  peopleCount: number;
  currency: string;
}

export interface CalculationResult {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export interface ReceiptScanResult {
  total: number | null;
  currency: string | null;
  confidence?: number;
}

export enum AppMode {
  CALCULATOR = 'CALCULATOR',
  SCANNER = 'SCANNER'
}
