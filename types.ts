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
  permissions: string[];
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