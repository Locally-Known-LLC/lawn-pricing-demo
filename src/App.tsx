import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Quotes from './components/Quotes';
import Widget from './components/Widget';
import Integrations from './components/Integrations';
import GrowthSuiteHome from './components/GrowthSuiteHome';
import UploadAddresses from './components/campaign/UploadAddresses';
import ServiceSelection from './components/campaign/ServiceSelection';
import DoorHangerBuilder from './components/campaign/DoorHangerBuilder';
import PrintOptions from './components/campaign/PrintOptions';
import CampaignAnalytics from './components/CampaignAnalytics';

type Page = 'dashboard' | 'quick-quote' | 'pricing' | 'quotes' | 'analytics' | 'widget' | 'billing' | 'growth' | 'campaign-upload' | 'campaign-service' | 'campaign-builder' | 'campaign-print' | 'campaign-analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [campaignStep, setCampaignStep] = useState(1);

  const handleCreateCampaign = () => {
    setCampaignStep(1);
    setCurrentPage('campaign-upload');
  };

  const handleViewCampaign = (id: string) => {
    setCurrentPage('campaign-analytics');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'pricing':
        return <Services />;
      case 'quotes':
        return <Quotes />;
      case 'widget':
        return <Widget />;
      case 'analytics':
        return <Integrations />;
      case 'growth':
        return (
          <GrowthSuiteHome
            onCreateCampaign={handleCreateCampaign}
            onViewCampaign={handleViewCampaign}
          />
        );
      case 'campaign-upload':
        return (
          <UploadAddresses
            onNext={() => {
              setCampaignStep(2);
              setCurrentPage('campaign-service');
            }}
          />
        );
      case 'campaign-service':
        return (
          <ServiceSelection
            onNext={() => {
              setCampaignStep(3);
              setCurrentPage('campaign-builder');
            }}
            onBack={() => {
              setCampaignStep(1);
              setCurrentPage('campaign-upload');
            }}
          />
        );
      case 'campaign-builder':
        return (
          <DoorHangerBuilder
            onNext={() => {
              setCampaignStep(4);
              setCurrentPage('campaign-print');
            }}
            onBack={() => {
              setCampaignStep(2);
              setCurrentPage('campaign-service');
            }}
          />
        );
      case 'campaign-print':
        return (
          <PrintOptions
            onBack={() => {
              setCampaignStep(3);
              setCurrentPage('campaign-builder');
            }}
            onComplete={() => {
              setCurrentPage('growth');
            }}
          />
        );
      case 'campaign-analytics':
        return (
          <CampaignAnalytics
            onBack={() => setCurrentPage('growth')}
          />
        );
      default:
        return (
          <div className="max-w-4xl mx-auto text-center py-8 md:py-12 lg:py-16 px-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
            </h1>
            <p className="text-sm md:text-base text-gray-600">This section is coming soon</p>
          </div>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}

export default App;
