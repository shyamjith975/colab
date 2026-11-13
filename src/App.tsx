import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';

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

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/creators" element={<DiscoverCreatorsPage />} />
              <Route path="/creators/:id" element={<CreatorProfilePage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route path="/sponsorships" element={<SponsorshipsPage />} />
              <Route path="/ugc-pros" element={<UgcMarketplacePage />} />
              <Route path="/ad-spaces" element={<AdSpaceMarketplacePage />} />
              <Route path="/collaborations/:id" element={<CollaborationDealRoomPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ai-tools" element={<AiToolsPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
