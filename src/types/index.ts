export interface IJob {
  _id: string;
  JobID: string;
  JobTitle: string;
  Company: string;
  Location: string;
  ApplicationURL: string;
  PostedDate: string | null;
  Description: string;
  GermanRequired?: boolean;
  thumbStatus?: 'up' | 'down' | null;
  Department?: string;
  ContractType?: string;
  sourceSite?: string;
  
  // ✅ New Fields from Backend
  Status?: 'pending_review' | 'active' | 'rejected';
  ConfidenceScore: number;
}