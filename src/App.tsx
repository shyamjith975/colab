import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';

// Universal Scroll to Top on page change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Pages
import { LandingPage } from './pages/LandingPage';
import { DiscoverCreatorsPage } from './pages/DiscoverCreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { SponsorshipsPage } from './pages/SponsorshipsPage';
import { UgcMarketplacePage } from './pages/UgcMarketplacePage';
import { AdSpaceMarketplacePage } from './pages/AdSpaceMarketplacePage';
import { CollaborationDealRoomPage } from './pages/CollaborationDealRoomPage';
import { MessagesPage } from './pages/MessagesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AiToolsPage } from './pages/AiToolsPage';
import { PricingPage } from './pages/PricingPage';
import { LocalAdsPage } from './pages/LocalAdsPage';
import { CollectivesPage } from './pages/CollectivesPage';
import { AffiliatesPage } from './pages/AffiliatesPage';
import { SponsorRequirementsPage } from './pages/SponsorRequirementsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/creators" element={<DiscoverCreatorsPage />} />
              <Route path="/creators/:id" element={<CreatorProfilePage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route path="/sponsorships" element={<SponsorshipsPage />} />
              <Route path="/sponsor-requirements" element={<SponsorRequirementsPage />} />
              <Route path="/ugc-pros" element={<UgcMarketplacePage />} />
              <Route path="/ad-spaces" element={<AdSpaceMarketplacePage />} />
              <Route path="/local-ads" element={<LocalAdsPage />} />
              <Route path="/collectives" element={<CollectivesPage />} />
              <Route path="/affiliates" element={<AffiliatesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/collaborations/:id" element={<CollaborationDealRoomPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ai-tools" element={<AiToolsPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
          <LoginModal />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;

