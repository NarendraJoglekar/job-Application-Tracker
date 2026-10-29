export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'
  | 'Accepted';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Accepted',
];

export type InterviewFormat =
  | 'Phone'
  | 'Video Call'
  | 'On-site'
  | 'Technical'
  | 'Panel'
  | 'Take-home Assignment';

export const INTERVIEW_FORMATS: InterviewFormat[] = [
  'Phone',
  'Video Call',
  'On-site',
  'Technical',
  'Panel',
  'Take-home Assignment',
];

export type ContactRelationship =
  | 'Recruiter'
  | 'Hiring Manager'
  | 'Referral'
  | 'Interviewer'
  | 'Other';

export const CONTACT_RELATIONSHIPS: ContactRelationship[] = [
  'Recruiter',
  'Hiring Manager',
  'Referral',
  'Interviewer',
  'Other',
];

export type DocumentType =
  | 'Resume'
  | 'Cover Letter'
  | 'Portfolio'
  | 'Reference Letter'
  | 'Other';

export const DOCUMENT_TYPES: DocumentType[] = [
  'Resume',
  'Cover Letter',
  'Portfolio',
  'Reference Letter',
  'Other',
];

export const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD ($)', 'AUD ($)', 'INR (₹)', 'SGD ($)', 'JPY (¥)'];

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  ownerId: string;
  role: string;
  company: string;
  location: string;
  jobUrl: string;
  jobDescription: string;
  appliedOn: string; // YYYY-MM-DD
  expectedSalary: number; // >= 0
  currency: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  ownerId: string;
  applicationId: string;
  title: string;
  startsAt: string; // YYYY-MM-DDTHH:mm
  endsAt: string; // YYYY-MM-DDTHH:mm
  locationOrUrl: string;
  interviewers: string;
  prepNotes: string;
  format: InterviewFormat;
  createdAt: string;
}

export interface Contact {
  id: string;
  ownerId: string;
  applicationId?: string; // Linked application id
  name: string;
  email: string;
  phone: string;
  company: string;
  details: string;
  relationship: ContactRelationship;
  createdAt: string;
}

export interface Note {
  id: string;
  ownerId: string;
  applicationId: string;
  title: string; // Title / next action
  body: string;
  followUpDue: string; // YYYY-MM-DD
  completed: boolean; // yes/no
  createdAt: string;
}

export interface Document {
  id: string;
  ownerId: string;
  applicationId: string;
  fileName: string;
  label: string; // Label / version e.g. "v2 - Backend"
  versionNotes: string;
  submittedOn: string; // YYYY-MM-DD
  type: DocumentType;
  fileSize?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  ownerId: string;
  applicationId: string;
  offerLabel: string;
  annualBaseSalary: number; // >= 0
  bonus: number; // >= 0
  equity: string;
  benefits: string;
  currency: string;
  responseDeadline: string; // YYYY-MM-DD
  negotiationNotes: string;
  createdAt: string;
}
