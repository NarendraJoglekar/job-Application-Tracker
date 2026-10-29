import { Application, Interview, Contact, Note, Document, Offer, User } from '../types';

export const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Alex Rivera',
  email: 'alex.dev@jobtrack.app',
  password: 'password123',
  createdAt: '2026-09-01T08:00:00.000Z',
};

export const INITIAL_USERS: User[] = [DEMO_USER];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-linear',
    ownerId: 'demo-user-1',
    role: 'Staff Frontend Architect',
    company: 'Linear',
    location: 'San Francisco, CA (Hybrid / Remote)',
    jobUrl: 'https://linear.app/careers/frontend-architect',
    jobDescription:
      'Lead the web architecture for high-performance keyboard-first productivity tooling. Work with React, TypeScript, WebAssembly, and local-first data sync engines. Require 6+ years shipping high-craft web apps.',
    appliedOn: '2026-10-10',
    expectedSalary: 195000,
    currency: 'USD ($)',
    status: 'Offer',
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-10-25T14:30:00.000Z',
  },
  {
    id: 'app-stripe',
    ownerId: 'demo-user-1',
    role: 'Senior Full Stack Engineer - Connect',
    company: 'Stripe',
    location: 'Seattle, WA (Remote Available)',
    jobUrl: 'https://stripe.com/jobs/connect-engineer',
    jobDescription:
      'Build core APIs and payment routing systems for global marketplaces. Focus on high reliability, idempotency, latency guarantees, and exceptional developer experience.',
    appliedOn: '2026-10-14',
    expectedSalary: 185000,
    currency: 'USD ($)',
    status: 'Interview',
    createdAt: '2026-10-14T09:15:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z',
  },
  {
    id: 'app-google',
    ownerId: 'demo-user-1',
    role: 'Senior Software Engineer, Cloud Core',
    company: 'Google',
    location: 'Mountain View, CA',
    jobUrl: 'https://careers.google.com/jobs/results/12345',
    jobDescription:
      'Design next-generation developer tooling and distributed telemetry for Google Cloud platform infrastructure. Strong systems algorithms and distributed consensus background required.',
    appliedOn: '2026-10-18',
    expectedSalary: 210000,
    currency: 'USD ($)',
    status: 'Phone Screen',
    createdAt: '2026-10-18T16:20:00.000Z',
    updatedAt: '2026-10-24T11:00:00.000Z',
  },
  {
    id: 'app-airbnb',
    ownerId: 'demo-user-1',
    role: 'Lead Design Engineer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    jobUrl: 'https://careers.airbnb.com/positions/design-engineer',
    jobDescription:
      'Bridge the gap between product design and engineering systems. Build delightful fluid micro-interactions, responsive accessibility primitives, and design system components.',
    appliedOn: '2026-10-12',
    expectedSalary: 180000,
    currency: 'USD ($)',
    status: 'Interview',
    createdAt: '2026-10-12T11:00:00.000Z',
    updatedAt: '2026-10-26T15:45:00.000Z',
  },
  {
    id: 'app-vercel',
    ownerId: 'demo-user-1',
    role: 'Developer Experience Engineer',
    company: 'Vercel',
    location: 'Remote (US)',
    jobUrl: 'https://vercel.com/careers/dx-engineer',
    jobDescription:
      'Empower millions of developers by crafting edge caching primitives, Turbopack integration testing, and Next.js sample suites.',
    appliedOn: '2026-10-22',
    expectedSalary: 165000,
    currency: 'USD ($)',
    status: 'Applied',
    createdAt: '2026-10-22T08:30:00.000Z',
    updatedAt: '2026-10-22T08:30:00.000Z',
  },
  {
    id: 'app-figma',
    ownerId: 'demo-user-1',
    role: 'Product Engineer, Design Systems',
    company: 'Figma',
    location: 'New York, NY',
    jobUrl: 'https://figma.com/careers/systems',
    jobDescription:
      'Develop real-time multiplayer design canvas widgets, plugin sandbox runtime, and typography tokens.',
    appliedOn: '2026-10-28',
    expectedSalary: 175000,
    currency: 'USD ($)',
    status: 'Wishlist',
    createdAt: '2026-10-28T14:10:00.000Z',
    updatedAt: '2026-10-28T14:10:00.000Z',
  },
  {
    id: 'app-datadog',
    ownerId: 'demo-user-1',
    role: 'Observability Engineer',
    company: 'Datadog',
    location: 'Boston, MA (Hybrid)',
    jobUrl: 'https://careers.datadoghq.com/detail/54321',
    jobDescription:
      'Build real-time streaming pipeline diagnostics and distributed tracing exporters.',
    appliedOn: '2026-09-20',
    expectedSalary: 160000,
    currency: 'USD ($)',
    status: 'Rejected',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z',
  },
  {
    id: 'app-scale',
    ownerId: 'demo-user-1',
    role: 'AI Infrastructure Specialist',
    company: 'Scale AI',
    location: 'San Francisco, CA',
    jobUrl: 'https://scale.com/careers/ai-infra',
    jobDescription:
      'Deploy high-throughput inference caching and evaluation clusters for autonomous agent benchmarks.',
    appliedOn: '2026-09-28',
    expectedSalary: 190000,
    currency: 'USD ($)',
    status: 'Withdrawn',
    createdAt: '2026-09-28T15:00:00.000Z',
    updatedAt: '2026-10-15T12:00:00.000Z',
  },
];

// Helper to format ISO datetime for current or upcoming days
const getUpcomingDate = (daysAhead: number, hours: number, minutes: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(hours);
  const min = pad(minutes);
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-linear-final',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    title: 'Executive & VP Engineering Fit Session',
    startsAt: getUpcomingDate(1, 10, 0),
    endsAt: getUpcomingDate(1, 11, 0),
    locationOrUrl: 'https://meet.google.com/lin-exec-fit',
    interviewers: 'Karri Saarinen (Co-Founder), Tuomas (Head of Product)',
    prepNotes:
      'Review Linear product roadmap philosophy. Discuss craftsmanship vs engineering velocity balance, local-first cache conflict resolution.',
    format: 'Video Call',
    createdAt: '2026-10-24T10:00:00.000Z',
  },
  {
    id: 'int-stripe-system',
    ownerId: 'demo-user-1',
    applicationId: 'app-stripe',
    title: 'Connect High-Availability System Design',
    startsAt: getUpcomingDate(3, 14, 0),
    endsAt: getUpcomingDate(3, 15, 30),
    locationOrUrl: 'https://stripe.zoom.us/j/948372615',
    interviewers: 'Marcus Brody (Staff Engineer), Maya Patel (Tech Lead)',
    prepNotes:
      'Review distributed idempotency keys, two-phase commits, circuit breaking in microservices, and webhook queue backpressure.',
    format: 'Technical',
    createdAt: '2026-10-25T11:00:00.000Z',
  },
  {
    id: 'int-google-screen',
    ownerId: 'demo-user-1',
    applicationId: 'app-google',
    title: 'Cloud Core Technical Screen',
    startsAt: getUpcomingDate(5, 11, 0),
    endsAt: getUpcomingDate(5, 12, 0),
    locationOrUrl: 'https://meet.google.com/goog-eng-screen',
    interviewers: 'David Lin (Senior Staff SRE)',
    prepNotes:
      'Brush up on concurrent locks, tree traversals, rate limiting leaky-bucket algorithms in Go/TypeScript.',
    format: 'Phone',
    createdAt: '2026-10-26T09:00:00.000Z',
  },
  {
    id: 'int-airbnb-panel',
    ownerId: 'demo-user-1',
    applicationId: 'app-airbnb',
    title: 'Design System & Accessibility Architecture Panel',
    startsAt: getUpcomingDate(6, 15, 0),
    endsAt: getUpcomingDate(6, 16, 30),
    locationOrUrl: 'https://airbnb.zoom.us/j/77889900',
    interviewers: 'Elena Rostova (Design Eng Director), Sam Kim (Principal Designer)',
    prepNotes:
      'Present custom canvas gesture handlers, cross-platform keyboard accessibility, and CSS token build pipeline.',
    format: 'Panel',
    createdAt: '2026-10-27T13:00:00.000Z',
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    name: 'Sarah Chen',
    email: 'sarah.chen@linear.app',
    phone: '+1 (415) 890-4421',
    company: 'Linear',
    details: 'Lead technical recruiter. Very responsive, prefers email and Slack connect.',
    relationship: 'Recruiter',
    createdAt: '2026-10-10T12:30:00.000Z',
  },
  {
    id: 'contact-2',
    ownerId: 'demo-user-1',
    applicationId: 'app-stripe',
    name: 'Marcus Brody',
    email: 'mbrody@stripe.com',
    phone: '+1 (206) 555-0199',
    company: 'Stripe',
    details: 'Hiring manager for Stripe Connect Core. Met at React Summit keynote.',
    relationship: 'Hiring Manager',
    createdAt: '2026-10-14T10:00:00.000Z',
  },
  {
    id: 'contact-3',
    ownerId: 'demo-user-1',
    applicationId: 'app-google',
    name: 'David Lin',
    email: 'dlin@google.com',
    phone: '+1 (650) 253-0000',
    company: 'Google',
    details: 'Ex-colleague who submitted internal referral for Cloud Core team.',
    relationship: 'Referral',
    createdAt: '2026-10-18T17:00:00.000Z',
  },
  {
    id: 'contact-4',
    ownerId: 'demo-user-1',
    applicationId: 'app-airbnb',
    name: 'Elena Rostova',
    email: 'elena.r@airbnb.com',
    phone: '+1 (415) 555-8833',
    company: 'Airbnb',
    details: 'Director of Design Engineering. Loves case studies on fluid micro-animations.',
    relationship: 'Interviewer',
    createdAt: '2026-10-20T14:00:00.000Z',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    title: 'Review Linear GraphQL & WebSocket Sync Specs',
    body: 'Re-read the blog post on client-side synchronization and SQLite in browser before final VP round.',
    followUpDue: getUpcomingDate(1, 9, 0).split('T')[0],
    completed: false,
    createdAt: '2026-10-24T11:00:00.000Z',
  },
  {
    id: 'note-2',
    ownerId: 'demo-user-1',
    applicationId: 'app-stripe',
    title: 'Prepare Stripe System Design Whiteboard Points',
    body: 'Diagram idempotent webhook delivery and database replication topologies for Stripe Connect.',
    followUpDue: getUpcomingDate(2, 17, 0).split('T')[0],
    completed: false,
    createdAt: '2026-10-25T14:00:00.000Z',
  },
  {
    id: 'note-3',
    ownerId: 'demo-user-1',
    applicationId: 'app-google',
    title: 'Check in with David Lin regarding referral status',
    body: 'Send quick message thanking him and confirming recruiter reach out.',
    followUpDue: getUpcomingDate(0, 12, 0).split('T')[0],
    completed: false,
    createdAt: '2026-10-26T10:00:00.000Z',
  },
  {
    id: 'note-4',
    ownerId: 'demo-user-1',
    applicationId: 'app-airbnb',
    title: 'Submitted take-home code and Figma design tokens',
    body: 'Exported GitHub repository with interactive Storybook documentation.',
    followUpDue: '2026-10-22',
    completed: true,
    createdAt: '2026-10-22T19:00:00.000Z',
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    fileName: 'Alex_Rivera_Staff_Frontend_Resume.pdf',
    label: 'v3.4 - Linear Custom Craft',
    versionNotes: 'Highlighted local-first sync architecture, WebAssembly benchmarks, and UI responsiveness.',
    submittedOn: '2026-10-10',
    type: 'Resume',
    fileSize: '342 KB',
    createdAt: '2026-10-10T12:05:00.000Z',
  },
  {
    id: 'doc-2',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    fileName: 'Cover_Letter_Linear_Craft.pdf',
    label: 'v1.0 - Craft Letter',
    versionNotes: 'Personal story on using Linear since beta and why craftsmanship matters.',
    submittedOn: '2026-10-10',
    type: 'Cover Letter',
    fileSize: '128 KB',
    createdAt: '2026-10-10T12:06:00.000Z',
  },
  {
    id: 'doc-3',
    ownerId: 'demo-user-1',
    applicationId: 'app-airbnb',
    fileName: 'Design_System_Portfolio_2026.pdf',
    label: 'v2.1 - Interactive Systems',
    versionNotes: 'Case studies for tokens, Figma-to-code pipelines, and accessibility.',
    submittedOn: '2026-10-12',
    type: 'Portfolio',
    fileSize: '2.4 MB',
    createdAt: '2026-10-12T11:15:00.000Z',
  },
  {
    id: 'doc-4',
    ownerId: 'demo-user-1',
    applicationId: 'app-stripe',
    fileName: 'Stripe_FullStack_Resume_v4.pdf',
    label: 'v4.0 - Distributed APIs',
    versionNotes: 'Expanded on payment gateway integration and distributed systems metrics.',
    submittedOn: '2026-10-14',
    type: 'Resume',
    fileSize: '380 KB',
    createdAt: '2026-10-14T09:20:00.000Z',
  },
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-linear',
    ownerId: 'demo-user-1',
    applicationId: 'app-linear',
    offerLabel: 'Initial Written Offer - Staff Architect',
    annualBaseSalary: 195000,
    bonus: 25000,
    equity: '$140,000 RSUs over 4 years',
    benefits: '100% covered health/dental/vision, $3,500 home office setup, unlimited PTO, annual wellness stipend',
    currency: 'USD ($)',
    responseDeadline: getUpcomingDate(9, 17, 0).split('T')[0],
    negotiationNotes:
      'Recruiter indicated flexibility on signing bonus and annual equity refreshers. Plan to request $205k base or additional equity grant after comparing with Stripe final outcome.',
    createdAt: '2026-10-25T14:30:00.000Z',
  },
];
