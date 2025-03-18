export enum LoanStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ILoanOffer {
  id: string;
  productId: string;
  name: string;
  tenure: number; // in months
  interestRate: number; // percentage
  amount: number; // fetched from product
  status: LoanStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateLoanOffer {
  productId: string;
  tenure: number;
  interestRate: number;
  amount: number;
  status: LoanStatus;
}
