export enum LoanStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ILoanOffer {
  id: string;
  productModelId: string;
  offer_name: string;
  tenure_months: number; // in months
  interest_rate: number; // percentage
  processing_fee: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateLoanOffer {
  offer_name: string;
  interest_rate: number;
  tenure_months: number;
  min_amount: number;
  max_amount: number;
  valid_from: Date;
  valid_to: Date;
  processing_fee: number;
  offer_details?: string;
  is_active: boolean;
}
