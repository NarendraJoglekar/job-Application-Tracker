import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Application,
  Interview,
  Contact,
  Note,
  Document as AppDocument,
  Offer,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_CONTACTS,
  INITIAL_NOTES,
  INITIAL_DOCUMENTS,
  INITIAL_OFFERS,
} from '../utils/seedData';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Current user's records (strictly owner-only)
  applications: Application[];
  interviews: Interview[];
  contacts: Contact[];
  notes: Note[];
  documents: AppDocument[];
  offers: Offer[];

  // Applications CRUD
  createApplication: (data: Omit<Application, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => Application;
  updateApplication: (id: string, data: Partial<Omit<Application, 'id' | 'ownerId' | 'createdAt'>>) => void;
  deleteApplication: (id: string) => { deletedAppId: string; cascadeCount: number };

  // Interviews CRUD
  createInterview: (data: Omit<Interview, 'id' | 'ownerId' | 'createdAt'>) => Interview;
  updateInterview: (id: string, data: Partial<Omit<Interview, 'id' | 'ownerId' | 'createdAt'>>) => void;
  deleteInterview: (id: string) => void;

  // Contacts CRUD
  createContact: (data: Omit<Contact, 'id' | 'ownerId' | 'createdAt'>) => Contact;
  updateContact: (id: string, data: Partial<Omit<Contact, 'id' | 'ownerId' | 'createdAt'>>) => void;
  deleteContact: (id: string) => void;

  // Notes CRUD
  createNote: (data: Omit<Note, 'id' | 'ownerId' | 'createdAt'>) => Note;
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'ownerId' | 'createdAt'>>) => void;
  toggleNoteComplete: (id: string) => void;
  deleteNote: (id: string) => void;

  // Documents CRUD
  createDocument: (data: Omit<AppDocument, 'id' | 'ownerId' | 'createdAt'>) => AppDocument;
  updateDocument: (id: string, data: Partial<Omit<AppDocument, 'id' | 'ownerId' | 'createdAt'>>) => void;
  deleteDocument: (id: string) => void;

  // Offers CRUD
  createOffer: (data: Omit<Offer, 'id' | 'ownerId' | 'createdAt'>) => Offer;
  updateOffer: (id: string, data: Partial<Omit<Offer, 'id' | 'ownerId' | 'createdAt'>>) => void;
  deleteOffer: (id: string) => void;

  // Helpers
  getApplication: (id: string) => Application | undefined;
  getInterviewsForApp: (appId: string) => Interview[];
  getContactsForApp: (appId: string) => Contact[];
  getNotesForApp: (appId: string) => Note[];
  getDocumentsForApp: (appId: string) => AppDocument[];
  getOffersForApp: (appId: string) => Offer[];

  // Metric stats
  metrics: {
    totalApplications: number;
    activeSearch: number;
    offersCount: number;
    upcomingInterviewsCount: number;
  };
  upcomingInterviewsNext7Days: Interview[];
  followUpsDue: Note[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'jobtrack_data_v1_';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showAlert } = useAuth();
  const userId = user?.id;

  // Raw global pools initialized from localStorage or initial seed
  const [allApplications, setAllApplications] = useState<Application[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}apps`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICATIONS;
  });

  const [allInterviews, setAllInterviews] = useState<Interview[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}interviews`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INTERVIEWS;
  });

  const [allContacts, setAllContacts] = useState<Contact[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}contacts`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONTACTS;
  });

  const [allNotes, setAllNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}notes`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTES;
  });

  const [allDocuments, setAllDocuments] = useState<AppDocument[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}docs`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOCUMENTS;
  });

  const [allOffers, setAllOffers] = useState<Offer[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}offers`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OFFERS;
  });

  // Persistent storage synchronizer
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}apps`, JSON.stringify(allApplications));
      localStorage.setItem(`${STORAGE_PREFIX}interviews`, JSON.stringify(allInterviews));
      localStorage.setItem(`${STORAGE_PREFIX}contacts`, JSON.stringify(allContacts));
      localStorage.setItem(`${STORAGE_PREFIX}notes`, JSON.stringify(allNotes));
      localStorage.setItem(`${STORAGE_PREFIX}docs`, JSON.stringify(allDocuments));
      localStorage.setItem(`${STORAGE_PREFIX}offers`, JSON.stringify(allOffers));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [allApplications, allInterviews, allContacts, allNotes, allDocuments, allOffers]);

  // OWNER-ONLY PRIVACY FILTER: Strictly return records matching user.id
  const applications = useMemo(() => {
    if (!userId) return [];
    return allApplications.filter((app) => app.ownerId === userId);
  }, [allApplications, userId]);

  const interviews = useMemo(() => {
    if (!userId) return [];
    return allInterviews.filter((int) => int.ownerId === userId);
  }, [allInterviews, userId]);

  const contacts = useMemo(() => {
    if (!userId) return [];
    return allContacts.filter((c) => c.ownerId === userId);
  }, [allContacts, userId]);

  const notes = useMemo(() => {
    if (!userId) return [];
    return allNotes.filter((n) => n.ownerId === userId);
  }, [allNotes, userId]);

  const documents = useMemo(() => {
    if (!userId) return [];
    return allDocuments.filter((d) => d.ownerId === userId);
  }, [allDocuments, userId]);

  const offers = useMemo(() => {
    if (!userId) return [];
    return allOffers.filter((o) => o.ownerId === userId);
  }, [allOffers, userId]);

  // Helpers
  const getApplication = (id: string) => applications.find((app) => app.id === id);
  const getInterviewsForApp = (appId: string) => interviews.filter((i) => i.applicationId === appId);
  const getContactsForApp = (appId: string) => contacts.filter((c) => c.applicationId === appId);
  const getNotesForApp = (appId: string) => notes.filter((n) => n.applicationId === appId);
  const getDocumentsForApp = (appId: string) => documents.filter((d) => d.applicationId === appId);
  const getOffersForApp = (appId: string) => offers.filter((o) => o.applicationId === appId);

  // Application CRUD with Cascade Deletion
  const createApplication = (data: Omit<Application, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newApp: Application = {
      ...data,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      expectedSalary: Math.max(0, Number(data.expectedSalary) || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllApplications((prev) => [newApp, ...prev]);
    showAlert('success', `Created application for ${newApp.role} at ${newApp.company}`);
    return newApp;
  };

  const updateApplication = (id: string, data: Partial<Omit<Application, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllApplications((prev) =>
      prev.map((app) => {
        if (app.id === id && app.ownerId === userId) {
          return {
            ...app,
            ...data,
            expectedSalary:
              data.expectedSalary !== undefined ? Math.max(0, Number(data.expectedSalary) || 0) : app.expectedSalary,
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      })
    );
  };

  const deleteApplication = (id: string) => {
    const target = allApplications.find((a) => a.id === id && a.ownerId === userId);
    if (!target) return { deletedAppId: id, cascadeCount: 0 };

    // Cascade delete all linked records
    let cascadeCount = 0;
    const linkedIntCount = allInterviews.filter((i) => i.applicationId === id).length;
    const linkedContCount = allContacts.filter((c) => c.applicationId === id).length;
    const linkedNoteCount = allNotes.filter((n) => n.applicationId === id).length;
    const linkedDocCount = allDocuments.filter((d) => d.applicationId === id).length;
    const linkedOffCount = allOffers.filter((o) => o.applicationId === id).length;

    cascadeCount = linkedIntCount + linkedContCount + linkedNoteCount + linkedDocCount + linkedOffCount;

    setAllApplications((prev) => prev.filter((a) => a.id !== id));
    setAllInterviews((prev) => prev.filter((i) => i.applicationId !== id));
    setAllContacts((prev) => prev.filter((c) => c.applicationId !== id));
    setAllNotes((prev) => prev.filter((n) => n.applicationId !== id));
    setAllDocuments((prev) => prev.filter((d) => d.applicationId !== id));
    setAllOffers((prev) => prev.filter((o) => o.applicationId !== id));

    showAlert(
      'info',
      `Deleted ${target.company} application and removed ${cascadeCount} linked records.`
    );

    return { deletedAppId: id, cascadeCount };
  };

  // Interview CRUD
  const createInterview = (data: Omit<Interview, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newInt: Interview = {
      ...data,
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };
    setAllInterviews((prev) => [newInt, ...prev]);
    showAlert('success', `Scheduled interview: ${newInt.title}`);
    return newInt;
  };

  const updateInterview = (id: string, data: Partial<Omit<Interview, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllInterviews((prev) =>
      prev.map((i) => (i.id === id && i.ownerId === userId ? { ...i, ...data } : i))
    );
    showAlert('success', 'Interview updated successfully.');
  };

  const deleteInterview = (id: string) => {
    setAllInterviews((prev) => prev.filter((i) => !(i.id === id && i.ownerId === userId)));
    showAlert('info', 'Interview deleted.');
  };

  // Contact CRUD
  const createContact = (data: Omit<Contact, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newContact: Contact = {
      ...data,
      id: `cont-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };
    setAllContacts((prev) => [newContact, ...prev]);
    showAlert('success', `Added contact: ${newContact.name}`);
    return newContact;
  };

  const updateContact = (id: string, data: Partial<Omit<Contact, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllContacts((prev) =>
      prev.map((c) => (c.id === id && c.ownerId === userId ? { ...c, ...data } : c))
    );
    showAlert('success', 'Contact updated successfully.');
  };

  const deleteContact = (id: string) => {
    setAllContacts((prev) => prev.filter((c) => !(c.id === id && c.ownerId === userId)));
    showAlert('info', 'Contact removed.');
  };

  // Note CRUD
  const createNote = (data: Omit<Note, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newNote: Note = {
      ...data,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };
    setAllNotes((prev) => [newNote, ...prev]);
    showAlert('success', `Added action item / note: ${newNote.title}`);
    return newNote;
  };

  const updateNote = (id: string, data: Partial<Omit<Note, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllNotes((prev) =>
      prev.map((n) => (n.id === id && n.ownerId === userId ? { ...n, ...data } : n))
    );
    showAlert('success', 'Note updated.');
  };

  const toggleNoteComplete = (id: string) => {
    setAllNotes((prev) =>
      prev.map((n) => {
        if (n.id === id && n.ownerId === userId) {
          const nextState = !n.completed;
          showAlert('info', nextState ? `Completed: "${n.title}"` : `Marked incomplete: "${n.title}"`);
          return { ...n, completed: nextState };
        }
        return n;
      })
    );
  };

  const deleteNote = (id: string) => {
    setAllNotes((prev) => prev.filter((n) => !(n.id === id && n.ownerId === userId)));
    showAlert('info', 'Note deleted.');
  };

  // Document CRUD
  const createDocument = (data: Omit<AppDocument, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newDoc: AppDocument = {
      ...data,
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };
    setAllDocuments((prev) => [newDoc, ...prev]);
    showAlert('success', `Added document: ${newDoc.fileName}`);
    return newDoc;
  };

  const updateDocument = (id: string, data: Partial<Omit<AppDocument, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllDocuments((prev) =>
      prev.map((d) => (d.id === id && d.ownerId === userId ? { ...d, ...data } : d))
    );
    showAlert('success', 'Document updated.');
  };

  const deleteDocument = (id: string) => {
    setAllDocuments((prev) => prev.filter((d) => !(d.id === id && d.ownerId === userId)));
    showAlert('info', 'Document removed.');
  };

  // Offer CRUD
  const createOffer = (data: Omit<Offer, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!userId) throw new Error('Must be authenticated');
    const newOffer: Offer = {
      ...data,
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      annualBaseSalary: Math.max(0, Number(data.annualBaseSalary) || 0),
      bonus: Math.max(0, Number(data.bonus) || 0),
      createdAt: new Date().toISOString(),
    };
    setAllOffers((prev) => [newOffer, ...prev]);
    // Also if application is not already in Offer status, suggest updating status
    updateApplication(data.applicationId, { status: 'Offer' });
    showAlert('success', `Recorded offer: ${newOffer.offerLabel}!`);
    return newOffer;
  };

  const updateOffer = (id: string, data: Partial<Omit<Offer, 'id' | 'ownerId' | 'createdAt'>>) => {
    setAllOffers((prev) =>
      prev.map((o) => {
        if (o.id === id && o.ownerId === userId) {
          return {
            ...o,
            ...data,
            annualBaseSalary:
              data.annualBaseSalary !== undefined
                ? Math.max(0, Number(data.annualBaseSalary) || 0)
                : o.annualBaseSalary,
            bonus: data.bonus !== undefined ? Math.max(0, Number(data.bonus) || 0) : o.bonus,
          };
        }
        return o;
      })
    );
    showAlert('success', 'Offer updated successfully.');
  };

  const deleteOffer = (id: string) => {
    setAllOffers((prev) => prev.filter((o) => !(o.id === id && o.ownerId === userId)));
    showAlert('info', 'Offer removed.');
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const totalApplications = applications.length;
    // Active search: Applied, Phone Screen, Interview, Offer
    const activeStatuses: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer'];
    const activeSearch = applications.filter((a) => activeStatuses.includes(a.status)).length;
    const offersCount = offers.length;

    const now = new Date().getTime();
    const upcomingInterviewsCount = interviews.filter((i) => {
      const start = new Date(i.startsAt).getTime();
      return start >= now;
    }).length;

    return {
      totalApplications,
      activeSearch,
      offersCount,
      upcomingInterviewsCount,
    };
  }, [applications, offers, interviews]);

  // Upcoming interviews in the next 7 days
  const upcomingInterviewsNext7Days = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    return interviews
      .filter((i) => {
        const interviewDate = new Date(i.startsAt);
        // Include today's interviews as well as next 7 days
        return interviewDate >= new Date(now.setHours(0, 0, 0, 0)) && interviewDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [interviews]);

  // Follow-ups due (incompleted notes with followUpDue date)
  const followUpsDue = useMemo(() => {
    return notes
      .filter((n) => !n.completed && Boolean(n.followUpDue))
      .sort((a, b) => (a.followUpDue > b.followUpDue ? 1 : -1));
  }, [notes]);

  return (
    <DataContext.Provider
      value={{
        applications,
        interviews,
        contacts,
        notes,
        documents,
        offers,
        createApplication,
        updateApplication,
        deleteApplication,
        createInterview,
        updateInterview,
        deleteInterview,
        createContact,
        updateContact,
        deleteContact,
        createNote,
        updateNote,
        toggleNoteComplete,
        deleteNote,
        createDocument,
        updateDocument,
        deleteDocument,
        createOffer,
        updateOffer,
        deleteOffer,
        getApplication,
        getInterviewsForApp,
        getContactsForApp,
        getNotesForApp,
        getDocumentsForApp,
        getOffersForApp,
        metrics,
        upcomingInterviewsNext7Days,
        followUpsDue,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
