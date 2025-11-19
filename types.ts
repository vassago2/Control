
export enum Language {
  ES = 'es',
  DE = 'de'
}

export enum UserRole {
  ADMIN = 'Administrator',
  MANAGER = 'Gestor',
  OFFICE = 'Oficina'
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  permissions: string[]; // e.g., 'crm:read', 'accounting:write'
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  status: 'draft' | 'posted';
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  matched: boolean;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string; // 'Bank Transfer', 'Credit Card', 'Cash'
  reference: string; // Invoice ID
}

export interface ClientVendor {
  id: string;
  type: 'client' | 'vendor';
  name: string;
  email: string;
  vatNumber: string;
  balance: number; // Positive for client means they owe us. Positive for vendor means we owe them.
  currency: string;
  paymentTerms: string; // e.g., "Net 30"
  outstandingInvoices: {
    id: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'overdue';
  }[];
  paymentHistory: Payment[];
}

export interface TranslationDictionary {
  [key: string]: {
    es: string;
    de: string;
  };
}

export interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
}
