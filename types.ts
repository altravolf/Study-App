export interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
}

export type View = 'main' | 'history';
