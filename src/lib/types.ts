
export type UserRole = 
  | 'PRESIDENT' 
  | 'ASSISTANT_PRESIDENT' 
  | 'SECRETARY_GENERAL' 
  | 'TREASURER' 
  | 'AUDITOR' 
  | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  savings: number;
  activeLoan?: number;
  joinDate: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  interestRate: number;
  interestType: 'FLAT' | 'REDUCING';
  maxDuration: number; // in months
}

export interface SystemSettings {
  contributionAmount: number;
  loanMultiplier: number;
  autoDebitDate: number; // day of month
  isAutoDebitActive: boolean;
}

export interface ContributionLog {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}
