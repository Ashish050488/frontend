export interface IJob {
  _id: string;
  JobID: string;
  JobTitle: string;
  ApplicationURL: string;
  Company: string;
  Location: string;
  Department: string;
  GermanRequired: boolean;
  PostedDate: string | null;
  ContractType: string;
  ExperienceLevel: string;
  Compensation: string;
  sourceSite: string;
  thumbStatus?: 'up' | 'down' | null; // New field for feedback
}