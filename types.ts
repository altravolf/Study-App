
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
}

export interface AppState {
  balance: number;
  history: Transaction[];
}

export type View = 'main' | 'history';
