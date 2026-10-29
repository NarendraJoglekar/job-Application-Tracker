/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AlertBanner } from './components/common/AlertBanner';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { AppLayout, AppPage } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ContactsPage } from './pages/ContactsPage';
import { NotesPage } from './pages/NotesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { OffersPage } from './pages/OffersPage';

const MainApp: React.FC = () => {
  const { user } = useAuth();

  // Public navigation state: 'landing' or 'login'
  const [publicView, setPublicView] = useState<'landing' | 'login'>('landing');

  // Authenticated navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Sync with URL Hash on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'login') {
      setPublicView('login');
    } else if (
      [
        'dashboard',
        'applications',
        'interviews',
        'contacts',
        'notes',
        'documents',
        'offers',
      ].includes(hash)
    ) {
      setCurrentPage(hash as AppPage);
    }
  }, []);

  // Update hash when page changes
  useEffect(() => {
    if (!user) {
      window.location.hash = publicView === 'login' ? 'login' : '';
    } else {
      window.location.hash = currentPage;
    }
  }, [user, publicView, currentPage]);

  // Navigate helper
  const handleNavigate = (page: AppPage, extraParam?: string) => {
    if (extraParam) {
      setSelectedAppId(extraParam);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If NOT signed in: render public landing or separate login page
  if (!user) {
    if (publicView === 'login') {
      return (
        <>
          <AlertBanner />
          <LoginPage
            onBackToLanding={() => setPublicView('landing')}
            onSuccess={() => {
              setPublicView('landing');
              setCurrentPage('dashboard');
            }}
          />
        </>
      );
    }

    return (
      <>
        <AlertBanner />
        <LandingPage
          onNavigateToLogin={() => setPublicView('login')}
          onEnterDashboard={() => {
            setCurrentPage('dashboard');
          }}
        />
      </>
    );
  }

  // SIGNED IN: White-and-Navy Sidebar Layout
  return (
    <>
      <AlertBanner />
      <AppLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        selectedAppId={selectedAppId}
      >
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
            onNavigateToSection={(sec) => handleNavigate(sec)}
          />
        )}

        {currentPage === 'applications' && (
          <ApplicationsPage
            onSelectApplication={(appId) => handleNavigate('application-detail', appId)}
          />
        )}

        {currentPage === 'application-detail' && (
          <ApplicationDetailPage
            applicationId={selectedAppId || ''}
            onBack={() => handleNavigate('applications')}
          />
        )}

        {currentPage === 'interviews' && (
          <InterviewsPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
          />
        )}

        {currentPage === 'contacts' && (
          <ContactsPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
          />
        )}

        {currentPage === 'notes' && (
          <NotesPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
          />
        )}

        {currentPage === 'documents' && (
          <DocumentsPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
          />
        )}

        {currentPage === 'offers' && (
          <OffersPage
            onNavigateToApp={(appId) => handleNavigate('application-detail', appId)}
          />
        )}
      </AppLayout>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
