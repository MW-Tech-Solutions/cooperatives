
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
  memberId: string;
  totalSavings: number;
  joinDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface SystemSettings {
  minMonthlyContribution: number;
  defaultPenaltyRate: number;
  loanToSavingsMultiplier: number;
  emergencyLoanInterest: number;
  loanEligibilityMonths: number;
  autoDebitDate: number;
  paystackPublicKey: string;
  paystackSecretKey: string;
  isAutoDebitActive: boolean;
}

export interface Loan {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  type: string;
  status: 'AWAITING_APPROVAL' | 'DISBURSED' | 'REJECTED' | 'PAID';
  createdAt: string;
}

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  type: string;
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  status: 'VERIFIED' | 'FLAGGED';
}
