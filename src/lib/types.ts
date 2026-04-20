
export type UserRole = 
  | 'PRESIDENT' 
  | 'ASSISTANT_PRESIDENT' 
  | 'SECRETARY_GENERAL' 
  | 'TREASURER' 
  | 'AUDITOR' 
  | 'MEMBER';

export type InterestType = 'FLAT' | 'REDUCING';

export interface LoanType {
  id: string;
  name: string;
  interestRate: number;
  interestType: InterestType;
  maxDurationMonths: number;
  minSavingsMonths: number;
  guarantorsRequired: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId: string;
  totalSavings: number;
  joinDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
  paystackAuthCode?: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

export interface BrandingSettings {
  systemName: string;
  logoUrl: string;
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
  loanTypes: LoanType[];
  totalPoolLiquidity: number;
  branding?: BrandingSettings;
  smtp?: SmtpSettings;
}

export interface Guarantor {
  userId: string;
  name: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  notifiedAt?: string;
  confirmedAt?: string;
}

export interface Loan {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  loanTypeId: string;
  status: 'AWAITING_NOTIFICATION_APPROVAL' | 'AWAITING_GUARANTORS' | 'AWAITING_APPROVAL' | 'SECRETARY_VERIFIED' | 'TREASURER_APPROVED' | 'DISBURSED' | 'REJECTED' | 'PAID';
  createdAt: string;
  guarantors: Guarantor[];
  repaymentSchedule: {
    dueDate: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
  }[];
}

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  type: 'MONTHLY' | 'SPECIAL' | 'LEVY';
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  target: string;
  timestamp: string;
  status: 'VERIFIED' | 'FLAGGED';
  metadata?: any;
}
