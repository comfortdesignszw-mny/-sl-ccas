
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

export enum TransactionStatus {
  VERIFIED = 'Verified',
  PENDING = 'Pending',
  AUDITED = 'Audited',
  APPROVED = 'Approved'
}

export enum Currency {
  USD = 'USD',
  ZAR = 'ZAR',
  BWP = 'BWP',
  ZIG = 'ZiG'
}

export enum AssetType {
  FIXED = 'Fixed',
  LIQUID = 'Liquid',
  INTANGIBLE = 'Intangible'
}

export interface UserProfile {
  name: string;
  role: string;
  contact: string;
}

export interface ChurchProfile {
  name: string;
  branch: string;
  district: string;
  province: string;
  address: string;
  contact: string;
  email: string;
  website: string;
  logo: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  currency: Currency;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastValuation: string;
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  method: string;
  status: TransactionStatus;
  amount: number;
  type: TransactionType;
  description: string;
  currency: Currency;
  eventId?: string;
  referenceNumber?: string;
}

export interface ChurchEvent {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'Ongoing' | 'Starting Soon' | 'Completed';
  image: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeGrowth: number;
  expenseGrowth: number;
}
